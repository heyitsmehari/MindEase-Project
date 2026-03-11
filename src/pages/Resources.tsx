import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Play, Search, Filter, Clock, ExternalLink, BookOpen, Video } from 'lucide-react';

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
    { value: 'all', label: 'All Videos' },
    { value: 'tedtalks', label: 'TED Talks' },
    { value: 'comforting', label: 'Comforting' },
    { value: 'coping', label: 'Coping' },
    { value: 'stories', label: 'Real stories' },
];

const BOOK_GENRES = [
    { value: 'all', label: 'All Books' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'anxiety', label: 'Anxiety & Stress' },
    { value: 'depression', label: 'Depression' },
    { value: 'memoirs', label: 'Memoirs' },
];

const getYtThumb = (url: string) => {
    try {
        const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : '';
    } catch {
        return '';
    }
};

const Resources: React.FC = () => {
    const [mainTab, setMainTab] = useState<'videos' | 'books'>('videos');
    const [videos, setVideos] = useState<VideoSession[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeVideoCat, setActiveVideoCat] = useState('all');
    const [activeBookGenre, setActiveBookGenre] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {

        let loaded = 0;
        const done = () => {
            if (++loaded === 2) setLoading(false);
        };

        const q1 = query(collection(db, 'videoSessions'), orderBy('createdAt', 'desc'));
        const q2 = query(collection(db, 'books'), orderBy('createdAt', 'desc'));

        const u1 = onSnapshot(
            q1,
            s => {
                setVideos(
                    s.docs.map(d => ({
                        id: d.id,
                        ...d.data(),
                    } as VideoSession))
                );
                done();
            },
            done
        );

        const u2 = onSnapshot(
            q2,
            s => {
                setBooks(
                    s.docs.map(d => ({
                        id: d.id,
                        ...d.data(),
                    } as Book))
                );
                done();
            },
            done
        );

        return () => {
            u1();
            u2();
        };

    }, []);

    const q = search.toLowerCase();

    const filteredVideos = videos.filter(
        v =>
            (activeVideoCat === 'all' || v.category === activeVideoCat) &&
            (!q ||
                v.title.toLowerCase().includes(q) ||
                v.description?.toLowerCase().includes(q))
    );

    const filteredBooks = books.filter(
        b =>
            (activeBookGenre === 'all' || b.genre === activeBookGenre) &&
            (!q ||
                b.title.toLowerCase().includes(q) ||
                b.author?.toLowerCase().includes(q))
    );

    return (

        <div
            className="min-h-screen pt-20 pb-16"
            style={{ background: '#FFF5F7' }}
        >

            <div className="text-center py-10 px-4 mb-6">

                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold mb-4"
                    style={{
                        background: 'rgba(212,97,122,0.12)',
                        backdropFilter: 'blur(10px)',
                        color: '#D4617A',
                    }}
                >
                    ✨ Curated by MindEase Team
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ color: '#3D1520' }}>
                    Mental Wellness <span style={{ color: '#D4617A' }}>Resources</span>
                </h1>

                <p
                    className="max-w-xl mx-auto text-sm"
                    style={{ color: '#7A3545' }}
                >
                    Explore guided videos and recommended books to support your mental health journey.
                </p>

            </div>

            <div className="max-w-6xl mx-auto px-4">

                {/* MAIN TABS */}

                <div className="flex gap-3 justify-center mb-6">

                    <button
                        onClick={() => setMainTab('videos')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.03]"
                        style={
                            mainTab === 'videos'
                                ? {
                                      background: 'linear-gradient(135deg,#D4617A,#C44A6A)',
                                      color: 'white',
                                      backdropFilter: 'blur(10px)',
                                      boxShadow: '0 10px 30px rgba(212,97,122,0.35)',
                                  }
                                : {
                                      background: 'rgba(255,255,255,0.75)',
                                      backdropFilter: 'blur(10px)',
                                      color: '#7A3545',
                                      boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
                                  }
                        }
                    >
                        <Video size={17} /> Videos
                    </button>

                    <button
                        onClick={() => setMainTab('books')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.03]"
                        style={
                            mainTab === 'books'
                                ? {
                                      background: 'linear-gradient(135deg,#D4617A,#C44A6A)',
                                      color: 'white',
                                      backdropFilter: 'blur(10px)',
                                      boxShadow: '0 10px 30px rgba(212,97,122,0.35)',
                                  }
                                : {
                                      background: 'rgba(255,255,255,0.75)',
                                      backdropFilter: 'blur(10px)',
                                      color: '#7A3545',
                                      boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
                                  }
                        }
                    >
                        <BookOpen size={17} /> Books
                    </button>

                </div>

                {/* SEARCH */}

                <div className="relative max-w-lg mx-auto mb-6">

                    <Search
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: '#D4617A' }}
                    />

                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={
                            mainTab === 'videos'
                                ? 'Search videos…'
                                : 'Search books or authors…'
                        }
                        className="w-full pl-12 pr-10 py-3.5 rounded-xl text-sm outline-none transition-all"
                        style={{
                            background: 'rgba(255,255,255,0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid #FBCFE8',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
                        }}
                    />

                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            ✕
                        </button>
                    )}

                </div>
                {/* VIDEO SECTION */}

                {mainTab === 'videos' && (
                    <>
                        <div className="flex flex-wrap gap-2 justify-center mb-5">

                            {VIDEO_CATS.map(category => (

                                <button
                                    key={category.value}
                                    onClick={() => setActiveVideoCat(category.value)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105"
                                    style={
                                        activeVideoCat === category.value
                                            ? {
                                                  background: 'linear-gradient(135deg,#D4617A,#C44A6A)',
                                                  color: 'white',
                                                  boxShadow: '0 8px 25px rgba(212,97,122,0.35)',
                                              }
                                            : {
                                                  background: 'rgba(255,255,255,0.7)',
                                                  backdropFilter: 'blur(10px)',
                                                  color: '#7A3545',
                                                  boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
                                              }
                                    }
                                >
                                    {category.label}
                                </button>

                            ))}

                        </div>

                        <div
                            className="flex items-center gap-1.5 text-xs mb-4 ml-1"
                            style={{ color: '#7A3545' }}
                        >
                            <Filter size={12} /> {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
                        </div>

                        {loading ? (

                            <Spinner />

                        ) : filteredVideos.length === 0 ? (

                            <Empty label="No videos found" />

                        ) : (

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                                {filteredVideos.map(video => {

                                    const thumb = getYtThumb(video.videoUrl);

                                    return (

                                        <div
                                            key={video.id}
                                            className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
                                            style={{
                                                background: 'rgba(255,255,255,0.75)',
                                                backdropFilter: 'blur(12px)',
                                                boxShadow: '0 8px 30px rgba(212,97,122,0.08)',
                                            }}
                                            onMouseEnter={e=>{
                                                e.currentTarget.style.boxShadow='0 18px 45px rgba(212,97,122,0.18)';
                                            }}
                                            onMouseLeave={e=>{
                                                e.currentTarget.style.boxShadow='0 8px 30px rgba(212,97,122,0.08)';
                                            }}
                                        >

                                            {/* VIDEO THUMBNAIL */}

                                            <div className="relative aspect-video overflow-hidden">

                                                {thumb ? (
                                                    <img
                                                        src={thumb}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-4xl">
                                                        🎥
                                                    </div>
                                                )}

                                                {/* PLAY OVERLAY */}

                                                <a
                                                    href={video.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all duration-300 group"
                                                >

                                                    <div
                                                        className="w-14 h-14 rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-200"
                                                        style={{
                                                            background:'rgba(255,255,255,0.9)',
                                                            backdropFilter:'blur(6px)'
                                                        }}
                                                    >
                                                        <Play size={22} fill="#D4617A" color="#D4617A" className="ml-1"/>
                                                    </div>

                                                </a>

                                                {/* DURATION */}

                                                <div
                                                    className="absolute bottom-2 right-2 flex items-center gap-1 text-white text-xs font-bold px-2 py-1 rounded-lg"
                                                    style={{ background:'rgba(0,0,0,0.65)' }}
                                                >
                                                    <Clock size={10}/> {video.duration}
                                                </div>

                                            </div>

                                            {/* CARD CONTENT */}

                                            <div className="p-5 flex flex-col flex-1">

                                                <h3
                                                    className="font-bold text-base mb-2 leading-snug line-clamp-2"
                                                    style={{ color:'#3D1520' }}
                                                >
                                                    {video.title}
                                                </h3>

                                                <p
                                                    className="text-sm leading-relaxed line-clamp-3 flex-1"
                                                    style={{ color:'#7A3545' }}
                                                >
                                                    {video.description}
                                                </p>

                                                {/* WATCH BUTTON */}

                                                <a
                                                    href={video.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.03]"
                                                    style={{
                                                        background:'linear-gradient(135deg,#D4617A,#C44A6A)',
                                                        backdropFilter:'blur(10px)',
                                                        boxShadow:'0 6px 18px rgba(212,97,122,0.25)'
                                                    }}
                                                    onMouseEnter={e=>{
                                                        e.currentTarget.style.boxShadow='0 10px 30px rgba(212,97,122,0.45)';
                                                    }}
                                                    onMouseLeave={e=>{
                                                        e.currentTarget.style.boxShadow='0 6px 18px rgba(212,97,122,0.25)';
                                                    }}
                                                >
                                                    <Play size={14} fill="white"/>
                                                    Watch Now
                                                    <ExternalLink size={12}/>
                                                </a>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        )}

                    </>
                )}

                {mainTab === 'books' && (
                    <>
                        <div className="flex flex-wrap gap-2 justify-center mb-5">

                            {BOOK_GENRES.map(bgenre => (

                                <button
                                    key={bgenre.value}
                                    onClick={() => setActiveBookGenre(bgenre.value)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105"
                                    style={
                                        activeBookGenre === bgenre.value
                                            ? {
                                                  background: 'linear-gradient(135deg,#D4617A,#C44A6A)',
                                                  color: 'white',
                                                  boxShadow: '0 8px 25px rgba(212,97,122,0.35)',
                                              }
                                            : {
                                                  background: 'rgba(255,255,255,0.7)',
                                                  backdropFilter: 'blur(10px)',
                                                  color: '#7A3545',
                                                  boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
                                              }
                                    }
                                >
                                    {bgenre.label}
                                </button>

                            ))}

                        </div>

                        <div
                            className="flex items-center gap-1.5 text-xs mb-4 ml-1"
                            style={{ color: '#7A3545' }}
                        >
                            <Filter size={12} /> {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
                        </div>

                        {loading ? (

                            <Spinner />

                        ) : filteredBooks.length === 0 ? (

                            <Empty label="No books added yet" />

                        ) : (

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                                {filteredBooks.map(book => (

                                    <div
                                        key={book.id}
                                        className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
                                        style={{
                                            background: 'rgba(255,255,255,0.75)',
                                            backdropFilter: 'blur(12px)',
                                            boxShadow: '0 8px 30px rgba(212,97,122,0.08)',
                                        }}
                                        onMouseEnter={e=>{
                                            e.currentTarget.style.boxShadow='0 18px 45px rgba(212,97,122,0.18)';
                                        }}
                                        onMouseLeave={e=>{
                                            e.currentTarget.style.boxShadow='0 8px 30px rgba(212,97,122,0.08)';
                                        }}
                                    >

                                        {/* BOOK COVER */}

                                        <div
                                            className="h-52 flex items-center justify-center overflow-hidden"
                                            style={{ background:'rgba(212,97,122,0.08)' }}
                                        >

                                            {book.coverUrl ? (
                                                <img
                                                    src={book.coverUrl}
                                                    alt={book.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-5xl">📚</div>
                                            )}

                                        </div>

                                        {/* BOOK CONTENT */}

                                        <div className="p-5 flex flex-col flex-1">

                                            <h3
                                                className="font-bold text-base mb-1 leading-snug line-clamp-2"
                                                style={{ color:'#3D1520' }}
                                            >
                                                {book.title}
                                            </h3>

                                            <p
                                                className="text-xs font-semibold mb-2"
                                                style={{ color:'#7A3545' }}
                                            >
                                                by {book.author}
                                            </p>

                                            <p
                                                className="text-sm leading-relaxed line-clamp-3 flex-1"
                                                style={{ color:'#7A3545' }}
                                            >
                                                {book.description}
                                            </p>

                                            {book.link ? (

                                                <a
                                                    href={book.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.03]"
                                                    style={{
                                                        background:'linear-gradient(135deg,#D4617A,#C44A6A)',
                                                        backdropFilter:'blur(10px)',
                                                        boxShadow:'0 6px 18px rgba(212,97,122,0.25)'
                                                    }}
                                                    onMouseEnter={e=>{
                                                        e.currentTarget.style.boxShadow='0 10px 30px rgba(212,97,122,0.45)';
                                                    }}
                                                    onMouseLeave={e=>{
                                                        e.currentTarget.style.boxShadow='0 6px 18px rgba(212,97,122,0.25)';
                                                    }}
                                                >
                                                    <BookOpen size={14}/>
                                                    Read / Buy
                                                    <ExternalLink size={12}/>
                                                </a>

                                            ) : (

                                                <div
                                                    className="mt-4 py-3 rounded-xl text-center text-sm font-bold"
                                                    style={{
                                                        background:'#FFF5F7',
                                                        color:'#7A3545'
                                                    }}
                                                >
                                                    📚 Available in Library
                                                </div>

                                            )}

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </>
                )}

            </div>
        </div>
    );
};

const Spinner = () => (
    <div className="text-center py-24">

        <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-3"
            style={{
                borderColor:'#FBCFE8',
                borderTopColor:'#D4617A'
            }}
        />

        <p
            style={{ color:'#7A3545' }}
            className="text-sm font-medium"
        >
            Loading resources…
        </p>

    </div>
);

const Empty = ({ label }: { label: string }) => (

    <div
        className="text-center py-24 rounded-2xl"
        style={{
            background:'rgba(255,255,255,0.75)',
            backdropFilter:'blur(12px)',
            boxShadow:'0 8px 30px rgba(212,97,122,0.08)'
        }}
    >

        <div className="text-5xl mb-3">🔍</div>

        <p
            className="font-bold"
            style={{ color:'#3D1520' }}
        >
            {label}
        </p>

        <p
            style={{ color:'#7A3545' }}
            className="text-sm mt-1"
        >
            Try a different filter or search term.
        </p>

    </div>

);

export default Resources;