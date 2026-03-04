import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  collection, query, where, onSnapshot,
  doc, updateDoc, arrayUnion, arrayRemove, getDoc,
  addDoc, serverTimestamp, orderBy,
} from 'firebase/firestore';
import {
  Heart, Share2, Clock, Sparkles, Quote, Bookmark,
  MessageCircle, Send, X, Star, ChevronDown
} from 'lucide-react';

// ── Colour constants ──────────────────────────────────────────────────
const ROSE = '#D4617A';

// ── Helper: show nickname or "Anonymous" — NEVER real name ───────────
const displayName = (story: any) =>
  story.nickname || story.anonymousName || 'Anonymous';

// ── Star Rating Component ────────────────────────────────────────────
const StarRating: React.FC<{
  value: number; onChange: (v: number) => void; readonly?: boolean; size?: number;
}> = ({ value, onChange, readonly = false, size = 22 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <Star
        key={s}
        size={size}
        onClick={() => !readonly && onChange(s)}
        className={`transition-all ${readonly ? '' : 'cursor-pointer hover:scale-125'}`}
        style={{
          color: s <= value ? '#F59E0B' : '#E5E7EB',
          fill: s <= value ? '#F59E0B' : 'none',
          strokeWidth: 1.5,
        }}
      />
    ))}
  </div>
);

// ── Comment Box ──────────────────────────────────────────────────────
const CommentBox: React.FC<{ storyId: string; onClose: () => void }> = ({ storyId, onClose }) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('storyId', '==', storyId),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => { });
    return () => unsub();
  }, [storyId]);

  const handleSend = async () => {
    if (!text.trim() || !auth.currentUser) return;
    setSending(true);
    try {
      // Fetch commenter's nickname from Firestore
      const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userData = userSnap.exists() ? userSnap.data() : {};
      const commenterName = userData.nickname || userData.name || 'Anonymous';

      await addDoc(collection(db, 'comments'), {
        storyId,
        uid: auth.currentUser.uid,
        author: commenterName,   // always nickname
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
      setText('');
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-5 border-t border-gray-100 pt-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">
          Comments ({comments.length})
        </p>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <X size={14} className="text-gray-400" />
        </button>
      </div>

      {/* Existing comments */}
      {comments.length > 0 && (
        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-xs font-black shrink-0"
                style={{ color: ROSE }}>
                {(c.author || 'A')[0].toUpperCase()}
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-2.5">
                <p className="text-xs font-black mb-0.5" style={{ color: ROSE }}>{c.author || 'Anonymous'}</p>
                <p className="text-sm text-gray-700">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New comment input */}
      {auth.currentUser ? (
        <div className="flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Write a supportive comment..."
            className="flex-1 px-4 py-2.5 rounded-2xl text-sm outline-none border border-gray-200 focus:border-rose-300 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className="px-4 py-2.5 rounded-2xl font-black text-white text-sm disabled:opacity-50 flex items-center gap-1.5 transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg,${ROSE},#C44A6A)` }}>
            {done ? '✓' : <Send size={14} />}
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-2">Login to leave a comment</p>
      )}
    </div>
  );
};

// ── Main Blog Component ──────────────────────────────────────────────
const Blog: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState<string | null>(null);

  // ── Rating state ──────────────────────────────────────────────────
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);

  // ── Load stories (type === 'story' only) ──────────────────────────
  useEffect(() => {
    const q = query(collection(db, 'articles'), where('status', '==', 'approved'));
    const unsub = onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Only show type 'story', not 'feedback'
      const filtered = all
        .filter((d: any) => d.type === 'story')
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setStories(filtered);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  // ── Load ratings ──────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'ratings'), snap => {
      const ratings = snap.docs.map(d => (d.data() as any).rating as number).filter(Boolean);
      if (ratings.length) {
        setAvgRating(ratings.reduce((a, b) => a + b, 0) / ratings.length);
        setRatingCount(ratings.length);
      }
    }, () => { });

    // Check if current user already rated
    if (auth.currentUser) {
      getDoc(doc(db, 'ratings', auth.currentUser.uid)).then(snap => {
        if (snap.exists()) {
          setUserRating((snap.data() as any).rating || 0);
          setRatingSubmitted(true);
        }
      });
    }
    return () => unsub();
  }, []);

  const submitRating = async (star: number) => {
    if (!auth.currentUser) return;
    setUserRating(star);
    await import('firebase/firestore').then(({ setDoc }) =>
      setDoc(doc(db, 'ratings', auth.currentUser!.uid), {
        rating: star,
        uid: auth.currentUser!.uid,
        createdAt: serverTimestamp(),
      })
    );
    setRatingSubmitted(true);
  };

  // ── Like toggle ───────────────────────────────────────────────────
  const toggleLike = async (storyId: string, likedBy: string[] = []) => {
    if (!auth.currentUser) { alert('Please login to like a post.'); return; }
    const uid = auth.currentUser.uid;
    const ref = doc(db, 'articles', storyId);
    const alreadyLiked = likedBy.includes(uid);
    await updateDoc(ref, {
      likedBy: alreadyLiked ? arrayRemove(uid) : arrayUnion(uid),
      likes: alreadyLiked
        ? Math.max(0, (likedBy.length || 1) - 1)
        : (likedBy.length || 0) + 1,
    });
  };

  // ── Share ─────────────────────────────────────────────────────────
  const handleShare = async (story: any) => {
    const shareText = `"${story.content.slice(0, 120)}..." — shared from MindEase Community\n${window.location.origin}/stories`;
    if (navigator.share) {
      try { await navigator.share({ title: 'MindEase Story', text: shareText, url: `${window.location.origin}/stories` }); }
      catch (_) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(160deg,#FFF5F7 0%,#FFE8ED 45%,#FFF0F3 100%)' }}>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden pt-24 pb-28 px-6"
        style={{ background: 'linear-gradient(135deg,#D4617A 0%,#C44A6A 50%,#9B2C5A 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%,-30%)' }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(-25%,35%)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-white/20">
            <Sparkles size={13} /> Community Stories
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
            Real Students,<br />
            <span className="text-pink-100">Real Journeys</span>
          </h1>
          <p className="text-white/75 text-base max-w-md mx-auto">
            Anonymous stories from peers at NIT Kurukshetra — approved, verified, and shared with care.
          </p>

          {/* Live Average Rating */}
          {avgRating !== null && (
            <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm font-bold">
              <Star size={14} className="fill-yellow-300 text-yellow-300" />
              {avgRating.toFixed(1)} community rating · {ratingCount} ratings
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-12 space-y-6">

        {/* ── Rate This Platform Card ── */}
        <div className="rounded-[2.5rem] p-6 text-center"
          style={{ background: 'rgba(255,255,255,0.82)', border: '1.5px solid rgba(249,197,204,0.6)', backdropFilter: 'blur(14px)', boxShadow: '0 8px 32px rgba(212,97,122,0.08)' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: ROSE }}>
            ⭐ Rate Your MindEase Experience
          </p>
          <p className="text-xs text-gray-400 mb-3">Your rating shows on the home page. Your identity stays anonymous.</p>

          {ratingSubmitted ? (
            <div className="flex flex-col items-center gap-2">
              <StarRating value={userRating} onChange={() => { }} readonly size={26} />
              <p className="text-xs font-bold text-emerald-600">✓ Thanks for rating! You gave {userRating}★</p>
              <button onClick={() => setRatingSubmitted(false)} className="text-[10px] text-gray-400 underline">Change my rating</button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    size={30}
                    onClick={() => submitRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer transition-all hover:scale-125"
                    style={{
                      color: s <= (hoverRating || userRating) ? '#F59E0B' : '#E5E7EB',
                      fill: s <= (hoverRating || userRating) ? '#F59E0B' : 'none',
                      strokeWidth: 1.5,
                    }}
                  />
                ))}
              </div>
              {!auth.currentUser && <p className="text-xs text-gray-400">Login to submit your rating</p>}
            </div>
          )}
        </div>

        {/* ── Stories Feed ── */}
        {loading ? (
          <div className="p-20 rounded-[2.5rem] text-center"
            style={{ background: 'rgba(255,255,255,0.70)', border: '1.5px solid rgba(249,197,204,0.5)' }}>
            <div className="w-12 h-12 border-4 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: '#FFE8ED', borderTopColor: ROSE }} />
            <p className="text-sm font-bold" style={{ color: ROSE }}>Loading stories…</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="p-20 rounded-[2.5rem] text-center"
            style={{ background: 'rgba(255,255,255,0.60)', border: '2px dashed rgba(249,197,204,0.8)' }}>
            <Bookmark className="mx-auto mb-4" size={48} style={{ color: '#F9C5CC' }} />
            <h3 className="text-xl font-black mb-2" style={{ color: '#3D1520' }}>No Stories Yet</h3>
            <p className="text-sm" style={{ color: '#7A3545', opacity: 0.65 }}>
              Be the first! Share your journey from your dashboard.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map(story => {
              const isLiked = (story.likedBy || []).includes(auth.currentUser?.uid || '');
              const likeCount = story.likedBy?.length || story.likes || 0;
              const showComments = openComments === story.id;

              return (
                <article key={story.id}
                  className="rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:shadow-2xl"
                  style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(249,197,204,0.6)', backdropFilter: 'blur(14px)', boxShadow: '0 8px 32px rgba(212,97,122,0.07)' }}>

                  <div className="p-7 md:p-9">
                    {/* Author row */}
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg"
                          style={{ background: 'rgba(212,97,122,0.10)', color: ROSE }}>
                          {displayName(story)[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-800 leading-none mb-0.5">
                            {displayName(story)}
                          </h4>
                          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase">
                            <Clock size={9} className="text-rose-400" />
                            {story.createdAt?.toDate?.().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) || 'Recent'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {story.userRole && (
                          <span className="text-[9px] font-black px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(255,232,237,0.9)', color: ROSE }}>
                            {story.userRole === 'alumni' ? '🌟 Alumni' : story.userRole === 'professor' ? '📚 Prof' : '🎓 Student'}
                          </span>
                        )}
                        <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2.5 py-1 rounded-full border border-emerald-100">
                          ✓ Verified
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative mb-7">
                      <Quote className="absolute -top-2 -left-1 opacity-5" size={50} style={{ color: ROSE }} />
                      <p className="relative z-10 text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                        {story.content}
                      </p>
                    </div>

                    {/* Interaction bar */}
                    <div className="flex items-center justify-between pt-5 border-t border-rose-50">
                      <div className="flex items-center gap-5">
                        {/* Like */}
                        <button
                          onClick={() => toggleLike(story.id, story.likedBy || [])}
                          className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest transition-all hover:scale-105"
                          style={{ color: isLiked ? '#D4617A' : '#9CA3AF' }}>
                          <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                          <span>{likeCount > 0 ? likeCount : ''} {likeCount === 1 ? 'Like' : likeCount > 1 ? 'Likes' : 'Like'}</span>
                        </button>

                        {/* Comment toggle */}
                        <button
                          onClick={() => setOpenComments(showComments ? null : story.id)}
                          className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest transition-all hover:scale-105"
                          style={{ color: showComments ? '#D4617A' : '#9CA3AF' }}>
                          <MessageCircle size={18} />
                          <span>Comment</span>
                          <ChevronDown size={12} style={{ transform: showComments ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                        </button>
                      </div>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(story)}
                        className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-all hover:scale-105">
                        <Share2 size={18} /> Share
                      </button>
                    </div>

                    {/* Comments section (expandable) */}
                    {showComments && (
                      <CommentBox storyId={story.id} onClose={() => setOpenComments(null)} />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;