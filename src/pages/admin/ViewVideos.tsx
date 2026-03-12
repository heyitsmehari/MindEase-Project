import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Play, Trash2, Eye, Edit } from 'lucide-react';

interface VideoSession {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
    category: string;
    createdAt?: any;
}

const ViewVideos: React.FC = () => {
    const [videos, setVideos] = useState<VideoSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingVideo, setEditingVideo] = useState<VideoSession | null>(null);

    useEffect(() => {
        const q = query(
            collection(db, "videoSessions"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedVideos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as VideoSession[];

            setVideos(fetchedVideos);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching videos:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await deleteDoc(doc(db, "videoSessions", id));
                alert("Video deleted successfully!");
            } catch (error) {
                console.error("Error deleting video:", error);
                alert("Error deleting video!");
            }
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVideo) return;

        try {
            const { id, createdAt, ...videoData } = editingVideo;
            await updateDoc(doc(db, "videoSessions", id), videoData);
            alert("Video updated successfully!");
            setEditingVideo(null);
        } catch (error) {
            console.error("Error updating video:", error);
            alert("Error updating video!");
        }
    };

    const CATEGORIES = [
        { value: 'comforting', emoji: '💬', label: 'Comforting', color: 'bg-purple-100 text-purple-700' },
        { value: 'tedtalks', emoji: '🧘', label: 'TED Talks', color: 'bg-green-100  text-green-700' },
        { value: 'coping', emoji: '🛡️', label: 'Coping', color: 'bg-gray-100   text-gray-700' },
        { value: 'stories', emoji: '🌿', label: 'Real stories', color: 'bg-teal-100   text-teal-700' },
    ];

    const getCategoryMeta = (category: string) =>
        CATEGORIES.find(c => c.value === category) || CATEGORIES[3];

    return (
        <div className="max-w-6xl">
            <div className="bg-white rounded-[2.5rem] shadow-sm border p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Play className="text-purple-600" /> Video Sessions
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">Manage all posted video sessions</p>
                    </div>
                    <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-bold">
                        {videos.length} Videos
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading videos...</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <Play className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500">No video sessions posted yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {videos.map((video) => (
                            <div
                                key={video.id}
                                className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all bg-gray-50"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-800">{video.title}</h3>
                                            {(() => {
                                                const meta = getCategoryMeta(video.category);
                                                return (
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${meta.color}`}>
                                                        {meta.emoji} {meta.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Play size={14} />
                                                {video.duration}
                                            </span>
                                            <a
                                                href={video.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-600 hover:underline flex items-center gap-1"
                                            >
                                                <Eye size={14} />
                                                View Video
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingVideo(video)}
                                            className="bg-blue-100 text-blue-600 p-3 rounded-xl hover:bg-blue-200 transition-all"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(video.id, video.title)}
                                            className="bg-red-100 text-red-600 p-3 rounded-xl hover:bg-red-200 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingVideo && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setEditingVideo(null)}
                >
                    <div
                        className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-6">Edit Video Session</h2>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <input
                                placeholder="Video Title"
                                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
                                value={editingVideo.title}
                                onChange={e => setEditingVideo({ ...editingVideo, title: e.target.value })}
                                required
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <select
                                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
                                    value={editingVideo.category}
                                    onChange={e => setEditingVideo({ ...editingVideo, category: e.target.value })}
                                    required
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Duration"
                                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
                                    value={editingVideo.duration}
                                    onChange={e => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                                    required
                                />
                            </div>

                            <input
                                type="url"
                                placeholder="YouTube URL"
                                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
                                value={editingVideo.videoUrl}
                                onChange={e => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                                required
                            />

                            <textarea
                                placeholder="Description"
                                className="w-full h-32 p-4 bg-gray-50 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-purple-500"
                                value={editingVideo.description}
                                onChange={e => setEditingVideo({ ...editingVideo, description: e.target.value })}
                                required
                            />

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all"
                                >
                                    Update Video
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingVideo(null)}
                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewVideos;