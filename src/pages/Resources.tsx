import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Play, Search, Filter, Clock, ExternalLink, BookOpen, Video } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────
interface VideoSession {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
    category: string;
}
interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    description: string;
    link?: string;
    coverUrl?: string;
}
const VIDEO_CATS = [
    { value: 'all', emoji: '🌟', label: 'All', color: 'bg-gray-100 text-gray-700', active: 'bg-gray-800 text-white' },
    { value: 'comforting', emoji: '🧘', label: 'Comforting', color: 'bg-blue-100 text-blue-700', active: 'bg-blue-600 text-white' },
    { value: 'tedx', emoji: '💬', label: 'TedX', color: 'bg-purple-100 text-purple-700', active: 'bg-purple-600 text-white' },
    { value: 'prof', emoji: '🛡️', label: 'Professional', color: 'bg-green-100 text-green-700', active: 'bg-green-600 text-white' },
    { value: 'advice', emoji: '📚', label: 'Advice', color: 'bg-orange-100 text-orange-700', active: 'bg-orange-500 text-white' },
];

const BOOK_GENRES = [
    { value: 'all', emoji: '📖', label: 'All Books', color: 'bg-gray-100 text-gray-700', active: 'bg-gray-800 text-white' },
    { value: 'self-help', emoji: '📗', label: 'Self Help', color: 'bg-green-100 text-green-700', active: 'bg-green-600 text-white' },
    { value: 'fiction', emoji: '😰', label: 'Fiction', color: 'bg-red-100 text-red-700', active: 'bg-red-500 text-white' },
    { value: 'professional', emoji: '🧘', label: 'Professional', color: 'bg-blue-100 text-blue-700', active: 'bg-blue-600 text-white' },
    { value: 'memoir', emoji: '💙', label: 'Memoir', color: 'bg-indigo-100 text-indigo-700', active: 'bg-indigo-600 text-white' },
    { value: 'creative', emoji: '❤️', label: 'Creative', color: 'bg-pink-100 text-pink-700', active: 'bg-pink-500 text-white' },
];

// ── YouTube thumbnail helper ──────────────────────────────────────────
const getYtThumb = (url: string) => {
    try {
        const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : '';
    } catch {
        return '';
    }
};

// ── Component ─────────────────────────────────────────────────────────
const Resources: React.FC = () => {
    const [mainTab, setMainTab] = useState<'videos' | 'books'>('videos');
    const [videos, setVideos] = useState<VideoSession[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeVideoCat, setActiveVideoCat] = useState('all');
    const [activeBookGenre, setActiveBookGenre] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        setLoading(true);

        const q1 = query(collection(db, 'videoSessions'), orderBy('createdAt', 'desc'));
        const q2 = query(collection(db, 'books'), orderBy('createdAt', 'desc'));

        const unsub1 = onSnapshot(
            q1,
            snapshot => {
                const vids: VideoSession[] = snapshot.docs.map(d => {
                    const data = d.data() as Omit<VideoSession, 'id'>;
                    return { id: d.id, ...data };
                });
                setVideos(vids);
            },
            err => console.error('Videos snapshot error:', err)
        );

        const unsub2 = onSnapshot(
            q2,
            snapshot => {
                const bks: Book[] = snapshot.docs.map(d => {
                    const data = d.data() as Omit<Book, 'id'>;
                    return { id: d.id, ...data };
                });
                setBooks(bks);
            },
            err => console.error('Books snapshot error:', err)
        );

        // Stop loading once both snapshots are received at least once
        const timeout = setTimeout(() => setLoading(false), 500); // fallback
        const cleanup = () => {
            unsub1();
            unsub2();
            clearTimeout(timeout);
        };
        return cleanup;
    }, []);

    const q = search.toLowerCase();
    const filteredVideos = videos.filter(v =>
        (activeVideoCat === 'all' || v.category === activeVideoCat) &&
        (!q || v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q))
    );
    const filteredBooks = books.filter(b =>
        (activeBookGenre === 'all' || b.genre === activeBookGenre) &&
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    );

    const getVidMeta = (cat: string) => VIDEO_CATS.find(c => c.value === cat) || VIDEO_CATS[0];
    const getBookMeta = (genre: string) => BOOK_GENRES.find(g => g.value === genre) || BOOK_GENRES[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 pb-16">
            {/* Hero */}
            <div className="relative py-12 px-4 text-center mb-6">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle,#818cf8,transparent)' }} />
                    <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full opacity-[0.15]"
                        style={{ background: 'radial-gradient(circle,#34d399,transparent)' }} />
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-3">
                    ✨ Curated by MindEase Team
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                    Mental Wellness <span className="text-indigo-600">Resources</span>
                </h1>
                <p className="text-gray-500 max-w-xl mx-auto text-base">
                    Explore guided videos and recommended books to support your mental health journey.
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {/* ── Main Tab ── */}
                <div className="flex gap-3 justify-center mb-6">
                    <button onClick={() => setMainTab('videos')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${mainTab === 'videos' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}>
                        <Video size={17} /> Videos
                    </button>
                    <button onClick={() => setMainTab('books')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${mainTab === 'books' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-300'}`}>
                        <BookOpen size={17} /> Books
                    </button>
                </div>

                {/* Search */}
                <div className="relative max-w-lg mx-auto mb-5">
                    <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder={mainTab === 'videos' ? 'Search videos…' : 'Search books or authors…'}
                        className="w-full pl-12 pr-10 py-3.5 bg-white rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm text-sm" />
                    {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">✕</button>}
                </div>

                {/* VIDEOS */}
                {mainTab === 'videos' && (
                    <>
                        {/* Category pills */}
                        <div className="flex flex-wrap gap-2 justify-center mb-5">
                            {VIDEO_CATS.map(cat => (
                                <button key={cat.value} onClick={() => setActiveVideoCat(cat.value)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeVideoCat === cat.value ? `${cat.active} shadow-md scale-105` : `${cat.color} hover:scale-105`}`}>
                                    {cat.emoji} {cat.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 ml-1">
                            <Filter size={12} /> {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
                        </div>

                        {loading ? <Spinner /> : filteredVideos.length === 0 ? <Empty label="No videos found" /> : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredVideos.map(video => {
                                    const thumb = getYtThumb(video.videoUrl);
                                    const cat = getVidMeta(video.category);
                                    return (
                                        <div key={video.id}
                                            className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                            <div className="relative aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
                                                {thumb ? <img src={thumb} alt={video.title} className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full flex items-center justify-center text-5xl">{cat.emoji}</div>}
                                                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer"
                                                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all group">
                                                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl scale-0 group-hover:scale-100 transition-transform duration-200">
                                                        <Play size={22} className="text-indigo-600 fill-indigo-600 ml-1" />
                                                    </div>
                                                </a>
                                                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                    <Clock size={10} /> {video.duration}
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <span className={`self-start text-[11px] font-black px-3 py-1 rounded-full mb-3 ${cat.color}`}>{cat.emoji} {cat.label}</span>
                                                <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug line-clamp-2">{video.title}</h3>
                                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">{video.description}</p>
                                                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer"
                                                    className="mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                                                    <Play size={14} fill="currentColor" /> Watch Now <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* BOOKS */}
                {mainTab === 'books' && (
                    <>
                        <div className="flex flex-wrap gap-2 justify-center mb-5">
                            {BOOK_GENRES.map(g => (
                                <button key={g.value} onClick={() => setActiveBookGenre(g.value)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeBookGenre === g.value ? `${g.active} shadow-md scale-105` : `${g.color} hover:scale-105`}`}>
                                    {g.emoji} {g.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 ml-1">
                            <Filter size={12} /> {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
                        </div>

                        {loading ? <Spinner /> : filteredBooks.length === 0 ? <Empty label="No books added yet" /> : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredBooks.map(book => {
                                    const gMeta = getBookMeta(book.genre);
                                    return (
                                        <div key={book.id}
                                            className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                            <div className="h-52 bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden flex items-center justify-center relative">
                                                {book.coverUrl ? (
                                                    <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="text-center px-4">
                                                        <div className="text-5xl mb-2">{gMeta.emoji}</div>
                                                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">{gMeta.label}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <span className={`self-start text-[11px] font-black px-3 py-1 rounded-full mb-3 ${gMeta.color}`}>{gMeta.emoji} {gMeta.label}</span>
                                                <h3 className="font-bold text-gray-900 text-base mb-1 leading-snug line-clamp-2">{book.title}</h3>
                                                <p className="text-xs text-gray-400 font-semibold mb-2">by {book.author}</p>
                                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">{book.description}</p>
                                                {book.link ? (
                                                    <a href={book.link} target="_blank" rel="noopener noreferrer"
                                                        className="mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors">
                                                        <BookOpen size={14} /> Read / Buy <ExternalLink size={12} />
                                                    </a>
                                                ) : (
                                                    <div className="mt-4 py-3 rounded-2xl text-center text-sm font-bold text-gray-400 bg-gray-50">
                                                        📚 Available in Library
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const Spinner: React.FC = () => (
    <div className="text-center py-24">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm font-medium">Loading resources…</p>
    </div>
);

const Empty: React.FC<{ label: string }> = ({ label }) => (
    <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-100">
        <div className="text-5xl mb-3">🔍</div>
        <p className="font-bold text-gray-600">{label}</p>
        <p className="text-gray-400 text-sm mt-1">Try a different filter or search term.</p>
    </div>
);

export default Resources;