import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { BookOpen, Trash2, Edit, ExternalLink } from 'lucide-react';

interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    description: string;
    link?: string;
    coverUrl?: string;
} 
 
const GENRES: Record<string, string> = {  
    'mindfulness': 'Mindfulness', 'anxiety': 'Anxiety & Stress', 
    'depression': 'Depression','memoir': 'Memoir', 
};
 
const ViewBooks: React.FC = () => { 
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, snap => {
            setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() } as Book)));
            setLoading(false);
        }, () => setLoading(false));
        return unsub;
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Delete "${title}"?`)) {
            try { await deleteDoc(doc(db, 'books', id)); }
            catch { alert('Error deleting book!'); }
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBook) return;
        try {
            const { id, ...data } = editingBook;
            await updateDoc(doc(db, 'books', id), data);
            setEditingBook(null);
        } catch { alert('Error updating book!'); }
    };

    return (
        <div className="max-w-6xl">
            <div className="bg-white rounded-[2.5rem] shadow-sm border p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <BookOpen className="text-amber-500" /> Recommended Books
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Manage books shown on the Resources page</p>
                    </div>
                    <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold">{books.length} Books</div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-gray-400">Loading books…</p>
                    </div>
                ) : books.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <BookOpen className="mx-auto text-gray-300 mb-3" size={44} />
                        <p className="text-gray-500">No books added yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {books.map(book => (
                            <div key={book.id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all bg-gray-50">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                            <h3 className="text-base font-bold text-gray-800">{book.title}</h3>
                                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                                                {GENRES[book.genre] || book.genre}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 italic mb-2">by {book.author}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
                                        {book.link && (
                                            <a href={book.link} target="_blank" rel="noopener noreferrer"
                                                className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-2">
                                                <ExternalLink size={11} /> View Link
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={() => setEditingBook(book)}
                                            className="bg-blue-100 text-blue-600 p-3 rounded-xl hover:bg-blue-200 transition-all">
                                            <Edit size={17} />
                                        </button>
                                        <button onClick={() => handleDelete(book.id, book.title)}
                                            className="bg-red-100 text-red-600 p-3 rounded-xl hover:bg-red-200 transition-all">
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingBook && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setEditingBook(null)}>
                    <div className="bg-white rounded-2xl p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-5">Edit Book</h2>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input placeholder="Book Title" value={editingBook.title} required
                                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400"
                                    onChange={e => setEditingBook({ ...editingBook, title: e.target.value })} />
                                <input placeholder="Author" value={editingBook.author} required
                                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400"
                                    onChange={e => setEditingBook({ ...editingBook, author: e.target.value })} />
                            </div>
                            <select value={editingBook.genre} required
                                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400"
                                onChange={e => setEditingBook({ ...editingBook, genre: e.target.value })}>
                                {Object.entries(GENRES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                            <input type="url" placeholder="Buy / Read Link (optional)" value={editingBook.link || ''}
                                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400"
                                onChange={e => setEditingBook({ ...editingBook, link: e.target.value })} />
                            <input type="url" placeholder="Cover Image URL (optional)" value={editingBook.coverUrl || ''}
                                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400"
                                onChange={e => setEditingBook({ ...editingBook, coverUrl: e.target.value })} />
                            <textarea placeholder="Description" rows={3} value={editingBook.description} required
                                className="w-full p-4 bg-gray-50 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-amber-400"
                                onChange={e => setEditingBook({ ...editingBook, description: e.target.value })} />
                            <div className="flex gap-3">
                                <button type="submit"
                                    className="flex-1 bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-all">
                                    Update Book
                                </button>
                                <button type="button" onClick={() => setEditingBook(null)}
                                    className="px-5 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50">
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

export default ViewBooks;