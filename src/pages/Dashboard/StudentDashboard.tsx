import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import usePageTitle from '../../hooks/usePageTitle';
import {
  collection, addDoc, query, where, onSnapshot,
  serverTimestamp, doc, updateDoc, deleteDoc, getDoc,
} from 'firebase/firestore';
import {
  Send, Clock, FileText, Heart, Calendar,
  CheckCircle, Hourglass, Plus, Layout,
  Pencil, Trash2, X, Save, Phone, Link as LinkIcon,
  CreditCard,
} from 'lucide-react';

type PostType = 'feedback' | 'story';

interface Article {
  id: string;
  uid: string;
  author: string;
  content: string;
  type: PostType;
  status: string;
  createdAt?: any;
}

interface EventItem {
  id: string;
  uid: string;
  author: string;
  content: string;
  type: string;
  status: string;
  eventTitle?: string;
  eventDate?: string;
  eventEndDate?: string;
  meetingLink?: string;
  paymentLink?: string;
  contactNumber?: string;
  imageUrl?: string;
  userRole?: string;
  createdAt?: any;
}

// ─── Glassmorphism Card ───────────────────────────────────────────────
const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
    style={{
      background: 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1.5px solid rgba(249,197,204,0.6)',
      boxShadow: '0 8px 32px rgba(212,97,122,0.08)',
    }}
  >
    {children}
  </div>
);

// ─── Post Submit Form ────────────────────────────────────────────────
const PostBox = ({
  type, label, icon, placeholder, onPosted,
}: {
  type: PostType;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  onPosted: () => void;
}) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !auth.currentUser) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'articles'), {
        uid: auth.currentUser.uid,
        author: auth.currentUser.displayName || 'Anonymous Student',
        content: text.trim(),
        type,
        userRole: 'student',
        college: 'NIT Kurukshetra',
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setText('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
      onPosted();
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard>
      <div className="flex items-center gap-3 px-6 py-4 border-b"
        style={{ borderColor: 'rgba(249,197,204,0.5)', background: 'linear-gradient(135deg,rgba(255,245,247,0.9),rgba(255,232,237,0.9))' }}>
        {icon}
        <h3 className="font-black text-base" style={{ color: '#3D1520' }}>{label}</h3>
        <span className="ml-auto text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,232,237,0.9)', color: '#D4617A' }}>
          {type === 'feedback' ? 'Appears on Home Page' : 'Appears on Stories Page'}
        </span>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          rows={4} placeholder={placeholder}
          className="w-full p-4 rounded-[1.5rem] outline-none resize-none text-sm transition-all"
          style={{ background: 'rgba(255,245,247,0.8)', border: '1.5px solid #F9C5CC', color: '#3D1520' }}
          onFocus={e => e.currentTarget.style.borderColor = '#D4617A'}
          onBlur={e => e.currentTarget.style.borderColor = '#F9C5CC'}
        />
        {success && (
          <div className="py-3 px-4 rounded-xl text-sm font-bold"
            style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
            ✅ Submitted! Admin will review and approve.
          </div>
        )}
        <button type="submit" disabled={loading || !text.trim()}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-white text-sm disabled:opacity-50 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg,#D4617A,#C44A6A)', boxShadow: '0 6px 20px rgba(212,97,122,0.28)' }}>
          <Send size={15} /> {loading ? 'Sending…' : 'Submit for Review'}
        </button>
      </form>
    </GlassCard>
  );
};

// ─── Post List ───────────────────────────────────────────────────────
const PostList = ({ title, icon, posts, editId, editText, setEditId, setEditText, onDelete, onEditSave }: any) => (
  <div className="space-y-4">
    <h3 className="font-black text-base flex items-center gap-2" style={{ color: '#3D1520' }}>{icon} {title}</h3>
    {posts.length === 0 ? (
      <div className="p-8 rounded-[2rem] text-center"
        style={{ background: 'rgba(255,255,255,0.50)', border: '2px dashed rgba(249,197,204,0.8)' }}>
        <Plus size={24} style={{ color: '#F9C5CC', margin: 'auto' }} />
        <p className="mt-2 text-sm" style={{ color: '#D4617A', opacity: 0.65 }}>Nothing yet — submit above!</p>
      </div>
    ) : posts.map((a: Article) => (
      <div key={a.id} className="p-5 rounded-[1.8rem] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        style={{ background: 'rgba(255,255,255,0.82)', border: '1.5px solid rgba(249,197,204,0.7)', boxShadow: '0 3px 12px rgba(212,97,122,0.05)' }}>
        {editId === a.id ? (
          <div className="space-y-3">
            <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={3}
              className="w-full p-3 rounded-xl outline-none resize-none text-sm"
              style={{ background: '#FFF5F7', border: '1.5px solid #F9C5CC', color: '#3D1520' }} />
            <p className="text-xs font-bold" style={{ color: '#D4617A', opacity: 0.7 }}>* Editing resets to Pending.</p>
            <div className="flex gap-3">
              <button onClick={() => onEditSave(a.id)} className="flex gap-1.5 px-5 py-2 rounded-xl text-xs font-black text-white items-center" style={{ background: '#D4617A' }}><Save size={12} /> Save</button>
              <button onClick={() => setEditId(null)} className="flex gap-1.5 px-4 py-2 rounded-xl text-xs font-bold items-center" style={{ background: '#FFF5F7', border: '1px solid #F9C5CC', color: '#7A3545' }}><X size={12} /> Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <p className="text-sm leading-relaxed" style={{ color: '#3D1520' }}>"{a.content}"</p>
              <p className="text-[10px] uppercase font-bold mt-2 flex items-center gap-1" style={{ color: '#D4617A', opacity: 0.55 }}>
                <Clock size={9} /> {a.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              {a.status === 'approved'
                ? <><CheckCircle size={16} className="text-emerald-500" /><span className="text-[9px] font-black text-emerald-500">LIVE</span></>
                : <><Hourglass size={16} className="text-orange-400 animate-pulse" /><span className="text-[9px] font-black text-orange-400">PENDING</span></>
              }
              <button onClick={() => { setEditId(a.id); setEditText(a.content); }} className="p-1 rounded-lg hover:bg-pink-50 transition-colors"><Pencil size={13} style={{ color: '#D4617A' }} /></button>
              <button onClick={() => onDelete(a.id)} className="p-1 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={13} className="text-red-400" /></button>
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

// ─── Event Card ────────────────────────────────────────────────────────
const EventCard = ({ ev }: { ev: EventItem }) => (
  <div className="rounded-[1.8rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
    style={{ background: 'rgba(255,255,255,0.82)', border: '1.5px solid rgba(249,197,204,0.7)', boxShadow: '0 3px 12px rgba(212,97,122,0.05)' }}>
    {ev.imageUrl && <img src={ev.imageUrl} alt="event banner" className="w-full h-36 object-cover" />}
    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,232,237,0.9)', color: '#D4617A' }}>
          {ev.userRole === 'professor' ? '👨‍🏫 Professor' : '🎓 Alumni'}
        </span>
        {ev.eventDate && (
          <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#7A3545' }}>
            <Calendar size={9} /> {ev.eventDate}
          </span>
        )}
      </div>
      {ev.eventTitle && <h4 className="font-black text-sm mb-1" style={{ color: '#3D1520' }}>{ev.eventTitle}</h4>}
      {ev.eventEndDate && (
        <p className="text-[11px] font-bold mb-1 flex items-center gap-1" style={{ color: '#C44A6A' }}>
          🏁 Ends: {ev.eventEndDate}
        </p>
      )}
      <p className="text-sm leading-relaxed mb-3" style={{ color: '#7A3545' }}>{ev.content}</p>
      <div className="space-y-1.5">
        {ev.contactNumber && (
          <p className="text-[11px] font-bold flex items-center gap-1.5" style={{ color: '#7A3545' }}>
            <Phone size={10} style={{ color: '#D4617A' }} /> {ev.contactNumber}
          </p>
        )}
        {ev.meetingLink && (
          <a href={ev.meetingLink} target="_blank" rel="noreferrer"
            className="text-[11px] font-bold flex items-center gap-1.5 hover:underline"
            style={{ color: '#4F46E5' }}>
            <LinkIcon size={10} /> Join Meeting
          </a>
        )}
        {ev.paymentLink && (
          <a href={ev.paymentLink} target="_blank" rel="noreferrer"
            className="text-[11px] font-bold flex items-center gap-1.5 hover:underline"
            style={{ color: '#059669' }}>
            <CreditCard size={10} /> Pay Now
          </a>
        )}
      </div>
      <p className="text-[10px] uppercase font-bold mt-3" style={{ color: '#D4617A', opacity: 0.55 }}>By {ev.author}</p>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────
const StudentDashboard: React.FC = () => {
  usePageTitle('Dashboard');
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState<Article[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    // Load profile photo
    getDoc(doc(db, 'users', auth.currentUser.uid)).then(snap => {
      if (snap.exists()) setProfilePhoto(snap.data().photoBase64 || '');
    });
    const q = query(collection(db, 'articles'), where('uid', '==', auth.currentUser.uid));
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Article));
      setMyPosts(docs.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });

    const evQ = query(collection(db, 'articles'), where('type', '==', 'event'), where('status', '==', 'approved'));
    const evUnsub = onSnapshot(evQ, snap => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() } as EventItem))
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });

    return () => { unsub(); evUnsub(); };
  }, [refresh]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post permanently?')) return;
    await deleteDoc(doc(db, 'articles', id));
  };

  const handleEditSave = async (id: string) => {
    if (!editText.trim()) return;
    await updateDoc(doc(db, 'articles', id), { content: editText, status: 'pending' });
    setEditId(null);
  };

  const feedbackPosts = myPosts.filter(a => a.type === 'feedback');
  const storyPosts = myPosts.filter(a => a.type === 'story');
  const stats = [
    { n: myPosts.length, l: 'Total Posts', icon: '📝', color: '#D4617A' },
    { n: myPosts.filter(a => a.status === 'approved').length, l: 'Live', icon: '✅', color: '#059669' },
    { n: myPosts.filter(a => a.status === 'pending').length, l: 'Pending', icon: '⏳', color: '#D97706' },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(160deg, #FFF5F7 0%, #FFE8ED 50%, #FFF0F3 100%)' }}>
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden pt-24 pb-28 px-6"
        style={{ background: 'linear-gradient(135deg,#D4617A 0%,#C44A6A 55%,#b83060 100%)' }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10"
          style={{ background: 'white', transform: 'translate(-20%, 30%)' }} />

        <div className="relative max-w-5xl mx-auto flex items-center gap-5 text-white">
          <div className="bg-white/15 p-4 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl">
            <Layout size={30} />
          </div>
          <div>
            <p className="text-pink-100 text-xs font-black uppercase tracking-widest mb-0.5">🎓 Student</p>
            <h1 className="text-3xl font-black">My Dashboard</h1>
            <p className="text-white/70 text-sm mt-0.5">NIT Kurukshetra</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div>
              <p className="font-black text-sm text-right">{auth.currentUser?.displayName || 'Student'}</p>
              <p className="text-white/60 text-xs text-right">{auth.currentUser?.email}</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              title="Edit Profile"
              className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/30 flex items-center justify-center transition-all hover:scale-110 hover:border-white/60"
              style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-lg">
                  {(auth.currentUser?.displayName || 'S')[0].toUpperCase()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-14 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <div key={i}
              className="p-5 rounded-[2rem] text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
              style={{
                background: 'rgba(255,255,255,0.80)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(249,197,204,0.6)',
                boxShadow: '0 4px 16px rgba(212,97,122,0.08)',
              }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-3xl font-black" style={{ color: s.color }}>{s.n}</p>
              <p className="text-[10px] uppercase font-bold mt-1" style={{ color: '#7A3545', opacity: 0.65 }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* ── Post Forms ── */}
        <PostBox
          type="feedback" label="Share Feedback"
          icon={<Heart size={18} style={{ color: '#D4617A' }} />}
          placeholder="A short quote or feeling about MindEase — may appear on the home page once approved by admin."
          onPosted={() => setRefresh(r => r + 1)}
        />
        <PostBox
          type="story" label="Post My Story"
          icon={<FileText size={18} style={{ color: '#D4617A' }} />}
          placeholder="Share your mental health journey, a tip for juniors, or how MindEase helped you."
          onPosted={() => setRefresh(r => r + 1)}
        />

        {/* ── My Posts Lists ── */}
        <PostList
          title="My Feedback" icon={<Heart size={16} style={{ color: '#D4617A' }} />}
          posts={feedbackPosts} editId={editId} editText={editText}
          setEditId={setEditId} setEditText={setEditText}
          onDelete={handleDelete} onEditSave={handleEditSave}
        />
        <PostList
          title="My Stories" icon={<FileText size={16} style={{ color: '#D4617A' }} />}
          posts={storyPosts} editId={editId} editText={editText}
          setEditId={setEditId} setEditText={setEditText}
          onDelete={handleDelete} onEditSave={handleEditSave}
        />

        {/* ── Upcoming Events from Alumni/Professors ── */}
        {events.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-black text-base flex items-center gap-2" style={{ color: '#3D1520' }}>
              <Calendar size={18} style={{ color: '#D4617A' }} /> Upcoming Events
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              {events.map(ev => <EventCard key={ev.id} ev={ev} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;