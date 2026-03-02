import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle, BarChart3, Users, Heart, ArrowRight,
  Brain, Calendar, Video, BookOpen, Star,
  ChevronDown, Sparkles, ChevronLeft, ChevronRight, Award
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MENTORS } from '../data/mentorData';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

// ─── THEME ───────────────────────────────────────────────────────────
// bg:       #FFF5F7  (lightest lavender)
// surface:  #FFE8ED  / white/70
// border:   #F9C5CC
// mid:      #F4A0B0
// accent:   #D4617A  (primary purple)
// text:     #3D1520  (dark)
// sub-text: #7A3545
// ──────────────────────────────────────────────────────────────────────

const FAQ_DATA = [
  {
    title: "GENERAL",
    faqs: [
      { question: "Is my information really anonymous?", answer: "Yes. You are never required to share personal identity. All chats are private and encrypted." },
      { question: "How do I book a counseling session?", answer: "Go to the Mentor page → choose a mentor → submit an appointment request. The mentor will reply with a suitable time." },
      { question: "Is the AI chatbot available 24/7?", answer: "Yes. The AI support is available anytime you need help." },
      { question: "Do I need an account?", answer: "No, most features work anonymously." },
      { question: "Can I use this on mobile?", answer: "Yes, it works on phone, tablet and laptop." },
      { question: "Who is this platform for?", answer: "Primarily students, but anyone needing emotional support can use it." },
      { question: "What if I don't know what I feel?", answer: "The chatbot helps identify emotions step-by-step." },
    ],
  },
  {
    title: "MEDITATION & MINDFULNESS",
    faqs: [
      { question: "I've never meditated before. Is that okay?", answer: "Yes! Guided sessions are beginner-friendly." },
      { question: "How long should I meditate?", answer: "Start 3-5 minutes and slowly increase." },
      { question: "Do I need silence?", answer: "No. Normal room environment works fine." },
      { question: "What if my mind keeps wandering?", answer: "That's normal — gently return to breathing." },
      { question: "Best time to meditate?", answer: "Morning or before sleep works best." },
      { question: "Can meditation improve focus?", answer: "Yes, regular practice boosts concentration." },
      { question: "Guided or silent meditation?", answer: "Guided is best for beginners." },
    ],
  },
  {
    title: "STRESS & ANXIETY",
    faqs: [
      { question: "Can this help with panic attacks?", answer: "Yes. Grounding exercises calm your nervous system." },
      { question: "Does mood tracking really help?", answer: "Yes. Recognizing patterns improves emotional control." },
      { question: "What to do during anxiety spike?", answer: "Use breathing and grounding tools immediately." },
      { question: "Why am I stressed for no reason?", answer: "Academic pressure and overthinking often cause hidden stress." },
      { question: "Does sleep affect anxiety?", answer: "Yes — poor sleep increases anxiety significantly." },
      { question: "How often track mood?", answer: "2–3 times daily works best." },
      { question: "Is college overwhelm normal?", answer: "Yes — many students experience it." },
    ],
  },
  {
    title: "PRIVACY & SAFETY",
    faqs: [
      { question: "Are my conversations stored?", answer: "Encrypted and anonymized only." },
      { question: "Can others see my stories?", answer: "Only if you choose to share anonymously." },
      { question: "Do counselors know my identity?", answer: "No unless you share it yourself." },
      { question: "Is my data sold?", answer: "Never." },
      { question: "Can admins read chats?", answer: "No human reads private conversations." },
      { question: "Can I delete my data?", answer: "Yes anytime." },
      { question: "Safe for sensitive topics?", answer: "Yes — designed as a safe space." },
    ],
  },
];

const SHOWCASE_CARDS = [
  {
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200",
    label: "Mindful Breathing",
    title: "Find Peace in Every Breath",
    desc: "Simple guided breathing exercises to calm your mind and reduce anxiety within minutes.",
  },
  {
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=1200",
    label: "Nature & Calm",
    title: "Nature Heals What Words Cannot",
    desc: "Reconnect with the world around you. Even five minutes of mindful awareness can shift your entire mood.",
  },
  {
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    label: "Community Support",
    title: "You Are Never Alone Here",
    desc: "Thousands of students share your journey. Find your tribe, share your story, heal together.",
  },
  {
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
    label: "Morning Meditation",
    title: "Start Your Day With Intention",
    desc: "Morning mindfulness sessions to set a positive tone for the day ahead — even just 5 minutes.",
  },
  {
    image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=1200",
    label: "Safe Space",
    title: "A Safe Haven Built for Students",
    desc: "Every student deserves a place to breathe, reflect, and seek help without judgment.",
  },
];

const QUOTE_CARDS = [
  { image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600', quote: '"You don\'t have to be positive all the time. It\'s perfectly okay to feel sad, angry, or overwhelmed."', color: '#D4617A' },
  { image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=600', quote: '"Healing is not linear — and that is perfectly okay."', color: '#EC4899' },
  { image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600', quote: '"Rest is productive. Your body needs stillness to heal."', color: '#C44A6A' },
  { image: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=600', quote: '"Asking for help is a sign of strength, not weakness."', color: '#10B981' },
  { image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600', quote: '"Your mental health is a priority. Never apologize for taking care of yourself."', color: '#F59E0B' },
  { image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600', quote: '"Small steps every day add up to big changes over time."', color: '#D4617A' },
];

const QUOTE_CARDS_ALT = [
  { image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600', quote: '"You are not alone — millions of students feel exactly what you feel."', color: '#EC4899' },
  { image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600', quote: '"Take a breath. You have survived every difficult day so far."', color: '#D4617A' },
  { image: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&q=80&w=600', quote: '"It\'s okay to not have it all together. No one truly does."', color: '#C44A6A' },
  { image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=600', quote: '"Emotions are not your enemy — they\'re your body\'s way of speaking."', color: '#10B981' },
  { image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600', quote: '"Progress, not perfection. You are doing better than you think."', color: '#F59E0B' },
  { image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600', quote: '"Community heals — share your story, inspire someone\'s journey."', color: '#D4617A' },
];

const QuoteCard = ({ image, quote, color }: { image: string; quote: string; color: string }) => (
  <div
    className="relative flex-shrink-0 rounded-[1.8rem] overflow-hidden cursor-pointer group"
    style={{ width: 300, height: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.14)', border: '2px solid rgba(255,255,255,0.80)' }}
  >
    <img src={image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(61,21,32,0.82) 0%, rgba(61,21,32,0.38) 55%, transparent 100%)' }} />
    <div className="absolute bottom-0 left-0 right-0 p-5">
      <div className="w-5 h-0.5 rounded-full mb-2" style={{ background: color }} />
      <p className="text-white text-xs font-semibold leading-relaxed">{quote}</p>
    </div>
  </div>
);

// ─── Fade-in on scroll ────────────────────────────────────────────────
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = '',
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Live Student Voices ─────────────────────────────────────────────
const ROLE_LABEL: Record<string, string> = { student: 'Student', alumni: 'Alumni', professor: 'Professor' };
const ROLE_COLOR: Record<string, string> = { student: '#6366F1', alumni: '#D4617A', professor: '#059669' };

const LiveStudentVoices: React.FC = () => {
  const [voices, setVoices] = useState<any[]>([]);
  useEffect(() => {
    const q = query(collection(db, 'articles'), where('status', '==', 'approved'));
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter((d: any) => d.type === 'feedback')
        .slice(0, 6);
      setVoices(docs);
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5"
            style={{ background: 'rgba(212,97,122,0.08)', border: '1.5px solid #F9C5CC', color: '#D4617A' }}>
            <Heart size={13} className="fill-current" /> Real Voices
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: '#3D1520' }}>
            Student{' '}
            <span style={{ background: 'linear-gradient(135deg, #D4617A, #C44A6A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Voices
            </span>
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: '#7A3545', opacity: 0.75 }}>
            Real stories and feedback from our community — reviewed and shared with care.
          </p>
        </div>

        {voices.length === 0 ? (
          <div className="text-center py-16 rounded-[2.5rem]" style={{ background: 'rgba(255,255,255,0.60)', border: '2px dashed #F9C5CC' }}>
            <Heart size={36} style={{ color: '#F9C5CC', margin: 'auto' }} />
            <p className="mt-4 font-medium" style={{ color: '#D4617A', opacity: 0.65 }}>
              Be the first to share your story! Login and submit from your dashboard.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voices.map((v, i) => (
              <motion.div key={v.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }}
                className="relative p-7 rounded-[2rem] group"
                style={{ background: 'rgba(255,255,255,0.75)', border: '1.5px solid #F9C5CC', backdropFilter: 'blur(14px)', boxShadow: '0 4px 20px rgba(212,97,122,0.06)' }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(90deg, #D4617A, #F4A0B0)' }} />
                <Heart size={18} className="fill-current mb-4" style={{ color: '#F4A0B0' }} />
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: '#3D1520' }}>"{v.content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black" style={{ color: '#3D1520' }}>{v.author || 'Anonymous'}</p>
                    <p className="text-xs" style={{ color: '#7A3545', opacity: 0.65 }}>{v.college || 'NIT Kurukshetra'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white"
                      style={{ background: ROLE_COLOR[v.userRole] || '#D4617A' }}>
                      {ROLE_LABEL[v.userRole] || 'Student'}
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full capitalize"
                      style={{ background: '#FFE8ED', color: '#D4617A' }}>{v.type || 'story'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const HERO_IMAGES = [

  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=800',
];




// ─── HOME ─────────────────────────────────────────────────────────────
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [carouselDir, setCarouselDir] = useState(1);
  const [heroImgIdx, setHeroImgIdx] = useState(0);
  const [liveUsers, setLiveUsers] = useState<number | null>(null);
  const [mentorIdx, setMentorIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setHeroImgIdx(p => (p + 1) % HERO_IMAGES.length), 3000);
    return () => clearInterval(t);
  }, []);

  // Fetch live user count from Firestore — real-time listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setLiveUsers(snap.size);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCarouselDir(1);
      setCarouselIdx((p) => (p + 1) % SHOWCASE_CARDS.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setMentorIdx((p) => (p + 1) % MENTORS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const goCarousel = (dir: 1 | -1) => {
    setCarouselDir(dir);
    setCarouselIdx((p) => (p + dir + SHOWCASE_CARDS.length) % SHOWCASE_CARDS.length);
  };

  const goMentor = (dir: 1 | -1) =>
    setMentorIdx((p) => (p + dir + MENTORS.length) % MENTORS.length);

  const mentorVisible = [
    (mentorIdx - 1 + MENTORS.length) % MENTORS.length,
    mentorIdx,
    (mentorIdx + 1) % MENTORS.length,
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'rgba(244,241,255,0.18)' }}>

      {/* ── ANIMATED GRADIENT BACKGROUND ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute rounded-full"
          style={{ width: 700, height: 700, top: '-15%', left: '-10%', background: 'radial-gradient(circle, rgba(249,197,204,0.45) 0%, transparent 70%)' }}
          animate={{ x: [0, 50, 0], y: [0, 35, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute rounded-full"
          style={{ width: 600, height: 600, bottom: '-10%', right: '-5%', background: 'radial-gradient(circle, rgba(232,133,154,0.30) 0%, transparent 70%)' }}
          animate={{ x: [0, -40, 0], y: [0, -25, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute rounded-full"
          style={{ width: 400, height: 400, top: '45%', left: '52%', background: 'radial-gradient(circle, rgba(255,220,225,0.35) 0%, transparent 70%)' }}
          animate={{ x: [0, 25, -18, 0], y: [0, -30, 18, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10">

        {/* \u2550\u2550 HERO \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}
        <section className="relative min-h-[94vh] flex items-center px-6 pt-24 pb-16 overflow-hidden">

          {/* Floating gradient blobs */}
          {[
            { color: 'rgba(232,133,154,0.65)', w: 380, h: 380, top: '2%', left: '5%', xA: [0, 50, 0], yA: [0, 35, 0], dur: 18, delay: 0 },
            { color: 'rgba(244,114,182,0.50)', w: 300, h: 300, top: '58%', left: '1%', xA: [0, -30, 0], yA: [0, -25, 0], dur: 22, delay: 2 },
            { color: 'rgba(232,133,154,0.55)', w: 340, h: 340, top: '10%', left: '68%', xA: [0, -40, 0], yA: [0, 30, 0], dur: 20, delay: 1 },
            { color: 'rgba(52,211,153,0.38)', w: 240, h: 240, top: '68%', left: '78%', xA: [0, 25, 0], yA: [0, -35, 0], dur: 25, delay: 3 },
            { color: 'rgba(251,191,36,0.35)', w: 220, h: 220, top: '42%', left: '45%', xA: [0, 22, 0], yA: [0, 22, 0], dur: 16, delay: 1.5 },
            { color: 'rgba(212,97,122,0.42)', w: 280, h: 280, top: '75%', left: '32%', xA: [0, -28, 0], yA: [0, 18, 0], dur: 21, delay: 0.8 },
          ].map((b, i) => (
            <motion.div key={i} className="absolute rounded-full pointer-events-none"
              style={{
                width: b.w, height: b.h, top: b.top, left: b.left,
                background: `radial-gradient(circle, ${b.color} 0%, transparent 68%)`, filter: 'blur(18px)'
              }}
              animate={{ x: b.xA, y: b.yA }}
              transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
            />
          ))}

          {/* 2-col grid */}
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* ── LEFT ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-3 tracking-tight"
                style={{ color: '#3D1520' }}
              >
                Your Mind Deserves{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #D4617A 0%, #E892A5 50%, #C44A6A 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  A Safe Place.
                </span>
              </motion.h1>

              {/* Shimmer underline */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-1.5 rounded-full mb-7 origin-left"
                style={{
                  width: '60%',
                  background: 'linear-gradient(90deg, #D4617A, #EC4899, #C44A6A, #D4617A)',
                  backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite',
                }}
              />

              <motion.p
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="text-lg md:text-xl font-medium leading-relaxed mb-9 max-w-lg"
                style={{ color: '#7A3545' }}
              >
                An anonymous sanctuary for students, alumni &amp; professors to heal, share, and grow — without fear or judgment.{' '}
                <strong style={{ color: '#D4617A' }}>You are not alone.</strong>
              </motion.p>

              {/* Two CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.34 }}
                className="flex flex-wrap gap-4 mb-10"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: 'rgba(212,97,122,0.35)', filter: 'blur(8px)' }}
                  />
                  <button
                    onClick={() => navigate('/sessions')}
                    className="relative flex items-center gap-3 px-10 py-4 text-base font-black text-white rounded-2xl transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #D4617A, #C44A6A)', boxShadow: '0 8px 28px rgba(212,97,122,0.40)' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 14px 50px rgba(212,97,122,0.65)'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(212,97,122,0.40)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <Users size={20} />
                    Guided Sessions
                    <ArrowRight size={16} />
                  </button>
                </div>

                <button
                  onClick={() => navigate('/appointment')}
                  className="px-9 py-4 text-base font-bold rounded-2xl transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.80)', border: '2px solid #F4A0B0', color: '#D4617A', backdropFilter: 'blur(8px)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,197,204,0.30)'; e.currentTarget.style.borderColor = '#E892A5'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.80)'; e.currentTarget.style.borderColor = '#F4A0B0'; }}
                >
                  Book Appointment
                </button>
              </motion.div>

              {/* LIVE stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-8"
              >
                {[
                  {
                    value: liveUsers !== null ? `${liveUsers.toLocaleString()}+` : '...',
                    label: 'Students Helped', color: '#D4617A', live: true,
                  },
                  { value: '4.9★', label: 'Average Rating', color: '#EC4899', live: false },
                  { value: '24/7', label: 'Support Available', color: '#10B981', live: false },
                ].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.12 }}
                    className="text-center relative"
                  >
                    {s.live && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                    <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs font-semibold mt-0.5" style={{ color: '#7A3545', opacity: 0.7 }}>{s.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── RIGHT: 3D cycling image card + floating emojis ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex items-center justify-center relative h-[520px]"
            >
              {/* Floating emoji bubbles — no background */}
              {[
                { emoji: '😊', top: '2%', left: '-5%', size: 72, dur: 4.2, delay: 0.0 },
                { emoji: '🤗', top: '14%', left: '96%', size: 66, dur: 5.0, delay: 0.7 },
                { emoji: '💜', top: '66%', left: '-7%', size: 70, dur: 4.6, delay: 1.2 },
                { emoji: '✨', top: '80%', left: '94%', size: 60, dur: 3.8, delay: 0.3 },
                { emoji: '🌸', top: '45%', left: '-8%', size: 68, dur: 5.5, delay: 1.8 },
                { emoji: '😮‍💨', top: '3%', left: '86%', size: 64, dur: 4.8, delay: 0.5 },
                { emoji: '🌟', top: '90%', left: '34%', size: 58, dur: 4.0, delay: 2.1 },
                { emoji: '🫂', top: '36%', left: '97%', size: 66, dur: 5.2, delay: 0.9 },
              ].map((e, i) => (
                <motion.div key={i}
                  className="absolute z-20 select-none pointer-events-none"
                  style={{
                    top: e.top, left: e.left, width: e.size, height: e.size,
                    fontSize: e.size * 0.86,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.18))',
                  }}
                  animate={{ y: [-12, 12, -12] }}
                  transition={{ duration: e.dur, repeat: Infinity, ease: 'easeInOut', delay: e.delay }}
                >
                  {e.emoji}
                </motion.div>
              ))}

              {/* 3D Perspective Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88, rotateY: -18 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '86%', height: 430, perspective: '1000px' }}
                className="relative z-10"
              >
                <div
                  className="w-full h-full rounded-[2.5rem] overflow-hidden relative"
                  style={{
                    transform: 'rotateX(5deg) rotateY(-9deg)',
                    transformStyle: 'preserve-3d',
                    border: '3px solid rgba(255,255,255,0.90)',
                    boxShadow: '0 50px 100px rgba(61,21,32,0.30), 0 20px 50px rgba(212,97,122,0.22), 16px 28px 70px rgba(0,0,0,0.18)',
                  }}
                >
                  {/* Cycling images with crossfade */}
                  <AnimatePresence mode="sync">
                    <motion.img
                      key={heroImgIdx}
                      src={HERO_IMAGES[heroImgIdx]}
                      alt="mental wellness"
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9 }}
                    />
                  </AnimatePresence>

                  {/* Depth gradient overlay */}
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(135deg, rgba(61,21,32,0.20) 0%, transparent 50%, rgba(61,21,32,0.38) 100%)'
                  }} />

                  {/* Gloss sheen */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, transparent 44%)',
                  }} />

                  {/* Dot indicators */}
                  <div className="absolute bottom-5 right-5 flex gap-2 z-10">
                    {HERO_IMAGES.map((_: string, i: number) => (
                      <button key={i} onClick={() => setHeroImgIdx(i)}
                        className="rounded-full transition-all duration-300"
                        style={{ width: i === heroImgIdx ? 24 : 7, height: 7, background: i === heroImgIdx ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)' }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </section>
        {/* ══ FEATURE CARDS ════════════════════════════════ */}
        <section className="px-6 py-16">
          <FadeIn>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-7">
              <FeatureCard icon={<MessageCircle size={28} />} title="AI Support"
                desc="Instant anonymous help tailored for the NITK community — available every second of every day."
                link="/chatbot" accent="#D4617Aff" light="#FFE8ED" />
              <FeatureCard icon={<BarChart3 size={28} />} title="Mood Tracker"
                desc="Visualize your emotional patterns and understand your mental health trends over time."
                link="/mood" accent="#C44A6A" light="#FFE0E6" />
              <FeatureCard icon={<Users size={28} />} title="Student Stories"
                desc="Read anonymous journeys from peers — and share yours to help someone feel less alone."
                link="/stories" accent="#E892A5" light="#F3EBFF" />
            </div>
          </FadeIn>
        </section>

        {/* ══ QUOTE MARQUEE CAROUSEL ════════════════════════ */}
        <section className="py-20 overflow-hidden">
          <FadeIn>
            <div className="text-center mb-14 px-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5"
                style={{ background: 'rgba(212,97,122,0.08)', border: '1.5px solid #F4A0B0', color: '#D4617A' }}>
                <Heart size={13} className="fill-current" /> Healing Spaces
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: '#3D1520' }}>
                Words That{' '}
                <span style={{ background: 'linear-gradient(135deg, #D4617A, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Heal
                </span>
              </h2>
              <p className="text-base font-medium max-w-lg mx-auto" style={{ color: '#7A3545', opacity: 0.75 }}>
                Gentle reminders that you are enough, and help is always near.
              </p>
            </div>
          </FadeIn>

          {/* Row 1 — scrolls left */}
          <div className="relative mb-5" style={{ maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}>
            <div className="flex gap-5 marquee-left" style={{ width: 'max-content' }}>
              {[...QUOTE_CARDS, ...QUOTE_CARDS].map((q, i) => (
                <QuoteCard key={i} {...q} />
              ))}
            </div>
          </div>

          {/* Row 2 — scrolls right */}
          <div className="relative" style={{ maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}>
            <div className="flex gap-5 marquee-right" style={{ width: 'max-content' }}>
              {[...QUOTE_CARDS_ALT, ...QUOTE_CARDS_ALT].map((q, i) => (
                <QuoteCard key={i} {...q} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ SERVICES ════════════════════════════════════ */}
        <section className="py-20 px-6">
          <FadeIn>
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: '#3D1520' }}>Wellness Hub</h2>
                  <p className="mt-3 text-lg" style={{ color: '#7A3545' }}>Everything you need for emotional resilience.</p>
                </div>
                <button onClick={() => navigate('/sessions')}
                  className="px-7 py-3 font-bold rounded-xl transition-all shrink-0"
                  style={{ background: 'rgba(212,97,122,0.08)', border: '1.5px solid #F4A0B0', color: '#D4617A' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,97,122,0.16)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,97,122,0.08)'}
                >
                  View All Services
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <ServiceTile icon={<Video size={26} />} title="Video Therapy" link="/sessions" accent="#D4617A" />
                <ServiceTile icon={<Calendar size={26} />} title="Counseling" link="/appointment" accent="#EC4899" />
                <ServiceTile icon={<BookOpen size={26} />} title="Wellness Events" link="/events" accent="#C44A6A" />
                <ServiceTile icon={<Users size={26} />} title="Peer Mentors" link="/mentor" accent="#059669" />
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ══ MENTOR CAROUSEL ══════════════════════════════ */}
        <section className="py-20 px-6">
          <FadeIn>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-5"
                  style={{ background: 'rgba(212,97,122,0.08)', border: '1.5px solid #F9C5CC', color: '#D4617A' }}>
                  <Award size={14} /> Expert Mentors
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: '#3D1520' }}>Meet Your Guides</h2>
                <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: '#7A3545' }}>
                  Certified professionals who specialize in student mental health — ready to walk with you.
                </p>
              </div>

              <div className="relative flex items-center justify-center gap-6">
                <button onClick={() => goMentor(-1)}
                  className="absolute left-0 z-20 w-11 h-11 rounded-2xl flex items-center justify-center transition-all"
                  style={{ background: 'rgba(212,97,122,0.10)', border: '1.5px solid #F4A0B0', color: '#D4617A' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,97,122,0.22)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,97,122,0.10)'}
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center justify-center gap-5 w-full overflow-hidden px-14">
                  {mentorVisible.map((mIdx, pos) => {
                    const mentor = MENTORS[mIdx];
                    const isActive = pos === 1;
                    return (
                      <motion.div
                        key={`${mIdx}-${pos}`}
                        layout
                        animate={{ scale: isActive ? 1 : 0.85, opacity: isActive ? 1 : 0.45 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => isActive ? navigate(`/mentor/${mentor.id}`) : (pos === 0 ? goMentor(-1) : goMentor(1))}
                        className="relative rounded-[2rem] p-6 cursor-pointer shrink-0 group transition-all"
                        style={{
                          width: isActive ? '270px' : '210px',
                          background: 'rgba(255,255,255,0.65)',
                          border: isActive ? '2px solid #F4A0B0' : '1.5px solid #FFE8ED',
                          backdropFilter: 'blur(16px)',
                          boxShadow: isActive ? '0 20px 60px rgba(212,97,122,0.15), 0 4px 16px rgba(0,0,0,0.06)' : 'none',
                        }}
                      >
                        <div className="rounded-[1.5rem] overflow-hidden mb-5 aspect-square">
                          <img src={mentor.image} alt={mentor.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        {isActive && (
                          <div className="absolute top-5 right-5 flex items-center gap-1 px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(254,240,138,0.5)', border: '1px solid rgba(234,179,8,0.35)' }}>
                            <Star size={11} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-yellow-700 text-xs font-black">{mentor.rating}</span>
                          </div>
                        )}
                        <h3 className="font-black text-base leading-tight mb-1 transition-colors" style={{ color: '#3D1520' }}>{mentor.name}</h3>
                        <p className="text-xs font-bold mb-2" style={{ color: '#D4617A' }}>{mentor.role}</p>
                        <p className="text-xs" style={{ color: '#7A3545', opacity: 0.7 }}>{mentor.specialty}</p>
                        {isActive && (
                          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-4 pt-4 flex items-center justify-between"
                            style={{ borderTop: '1.5px solid #FFE8ED' }}>
                            <span className="text-xs" style={{ color: '#7A3545', opacity: 0.55 }}>{mentor.experience}</span>
                            <span className="text-xs font-black px-3 py-1.5 rounded-xl"
                              style={{ background: 'rgba(212,97,122,0.10)', color: '#D4617A' }}>
                              View Profile →
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <button onClick={() => goMentor(1)}
                  className="absolute right-0 z-20 w-11 h-11 rounded-2xl flex items-center justify-center transition-all"
                  style={{ background: 'rgba(212,97,122,0.10)', border: '1.5px solid #F4A0B0', color: '#D4617A' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,97,122,0.22)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,97,122,0.10)'}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {MENTORS.map((_, i) => (
                  <button key={i} onClick={() => setMentorIdx(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === mentorIdx ? 24 : 7, height: 7,
                      background: i === mentorIdx ? 'linear-gradient(90deg, #D4617A, #C44A6A)' : '#F9C5CC',
                    }}
                  />
                ))}
              </div>

              <div className="text-center mt-10">
                <button onClick={() => navigate('/mentor')}
                  className="px-10 py-4 font-black text-white rounded-2xl transition-all text-base"
                  style={{ background: 'linear-gradient(135deg, #D4617A, #C44A6A)', boxShadow: '0 8px 30px rgba(212,97,122,0.30)' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 45px rgba(212,97,122,0.50)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,97,122,0.30)')}
                >
                  Meet All Mentors →
                </button>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ══ LIVE STUDENT VOICES ════════════════════════════ */}
        <LiveStudentVoices />


        {/* ══ FAQ ══════════════════════════════════════════ */}
        <section className="py-20 px-6">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight" style={{ color: '#3D1520' }}>Frequently Asked</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {FAQ_DATA.map((cat, i) => (
                    <button key={i} onClick={() => { setActiveCategory(i); setOpenFaq(null); }}
                      className="px-6 py-2.5 rounded-full font-bold text-sm transition-all"
                      style={activeCategory === i
                        ? { background: 'linear-gradient(135deg, #D4617A, #C44A6A)', color: 'white', boxShadow: '0 4px 20px rgba(212,97,122,0.30)' }
                        : { background: 'rgba(255,255,255,0.60)', border: '1.5px solid #F9C5CC', color: '#7A3545' }
                      }
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {FAQ_DATA[activeCategory].faqs.map((f, i) => (
                  <GlassAccordion key={i} question={f.question} answer={f.answer}
                    isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ══ PREMIUM CTA ════════════════════════════════════════════ */}
        <section className="py-16 px-6 pb-28">
          <FadeIn>
            <div className="max-w-5xl mx-auto relative rounded-[3rem] overflow-hidden text-center"
              style={{
                background: 'linear-gradient(135deg, #C44A6A 0%, #D4617A 40%, #b83060 100%)',
                boxShadow: '0 40px 100px rgba(196,74,106,0.45), 0 12px 40px rgba(0,0,0,0.15)',
              }}>

              {/* Animated rings */}
              {[0, 1].map(j => (
                <motion.div key={j}
                  animate={{ rotate: j === 0 ? 360 : -360 }}
                  transition={{ duration: j === 0 ? 26 : 34, repeat: Infinity, ease: 'linear' }}
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    width: j === 0 ? 380 : 260, height: j === 0 ? 380 : 260,
                    top: j === 0 ? '-110px' : 'auto', right: j === 0 ? '-110px' : 'auto',
                    bottom: j === 1 ? '-80px' : 'auto', left: j === 1 ? '-80px' : 'auto',
                    border: `${j === 0 ? 48 : 32}px solid rgba(255,255,255,0.055)`,
                  }}
                />
              ))}

              {/* Floating emojis */}
              {['❤️', '💜', '🌸', '✨'].map((em, i) => (
                <motion.span key={i} className="absolute text-3xl select-none pointer-events-none"
                  style={{ left: `${10 + i * 24}%`, top: i % 2 === 0 ? '10%' : '72%' }}
                  animate={{ y: [0, -16, 0], opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                >{em}</motion.span>
              ))}

              <div className="relative z-10 px-8 py-20">
                <motion.div
                  initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold mb-8"
                  style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.30)', color: 'white' }}
                >
                  <Heart size={14} className="fill-current animate-pulse" /> Trusted by 5,000+ Students at NIT Kurukshetra
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1 }}
                  className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight tracking-tight"
                >
                  You Deserve to{' '}
                  <span style={{ background: 'linear-gradient(135deg, #F9C5CC, #FFE8ED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Feel Better.
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                >
                  Join thousands of students, alumni, and professors who have started their mental wellness journey. Your first step is just one click away.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-wrap justify-center gap-5"
                >
                  <button onClick={() => navigate('/appointment')}
                    className="px-12 py-5 font-black text-[#C44A6A] text-lg rounded-2xl transition-all active:scale-95"
                    style={{ background: 'white', boxShadow: '0 8px 32px rgba(255,255,255,0.35)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 16px 50px rgba(255,255,255,0.55)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,255,255,0.35)'; }}
                  >
                    Book a Free Session →
                  </button>
                  <button onClick={() => navigate('/chatbot')}
                    className="px-10 py-5 font-bold text-white text-lg rounded-2xl transition-all active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.35)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.26)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  >
                    Talk to AI Now
                  </button>
                </motion.div>

              </div>
            </div>
          </FadeIn>
        </section>

      </div>
    </div >
  );
};



// ─── SUB COMPONENTS ─────────────────────────────────────────────────

const FeatureCard = ({ icon, title, desc, link, accent, light }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(link)}
      className="relative p-8 rounded-[2.5rem] cursor-pointer group overflow-hidden transition-all duration-300"
      style={{ background: 'rgba(255,255,255,0.60)', border: '1.5px solid #F9C5CC', backdropFilter: 'blur(14px)' }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 20px 60px rgba(212,97,122,0.15), 0 4px 20px rgba(0,0,0,0.06)`;
        e.currentTarget.style.borderColor = accent + '80';
        e.currentTarget.style.background = 'rgba(255,255,255,0.85)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#F9C5CC';
        e.currentTarget.style.background = 'rgba(255,255,255,0.60)';
      }}
    >
      {/* Animated gradient bar at bottom — slides up on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: `linear-gradient(90deg, ${accent}, #F4A0B0, ${accent})` }}
      />
      {/* Soft top-left accent glow on hover */}
      <div
        className="absolute -top-8 -left-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${light} 0%, transparent 70%)`, filter: 'blur(12px)' }}
      />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 transition-transform duration-300 group-hover:scale-110"
          style={{ background: light, border: `1.5px solid ${accent}25`, color: accent }}>
          {icon}
        </div>
        <h3 className="text-2xl font-black mb-4 leading-tight" style={{ color: '#3D1520' }}>{title}</h3>
        <p className="text-base leading-relaxed mb-7" style={{ color: '#7A3545', opacity: 0.8 }}>{desc}</p>
        <div className="flex items-center gap-2 font-black text-sm group-hover:gap-3 transition-all" style={{ color: accent }}>
          Explore <ArrowRight size={16} />
        </div>
      </div>
    </motion.div>
  );
};

const ServiceTile = ({ icon, title, link, accent }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(link)}
      className="p-7 rounded-[2rem] cursor-pointer text-center group transition-all"
      style={{ background: 'rgba(255,255,255,0.65)', border: '1.5px solid #F9C5CC', backdropFilter: 'blur(12px)' }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.90)';
        e.currentTarget.style.borderColor = accent + '60';
        e.currentTarget.style.boxShadow = `0 14px 40px rgba(0,0,0,0.08), 0 0 20px ${accent}25`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.65)';
        e.currentTarget.style.borderColor = '#F9C5CC';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-125"
        style={{ background: accent + '15', color: accent }}>
        {icon}
      </div>
      <h3 className="font-black text-sm" style={{ color: '#3D1520' }}>{title}</h3>
    </motion.div>
  );
};



const GlassAccordion = ({ question, answer, isOpen, onClick }: any) => (
  <div className="rounded-[2rem] overflow-hidden transition-all"
    style={{
      background: isOpen ? 'rgba(212,97,122,0.06)' : 'rgba(255,255,255,0.60)',
      border: `1.5px solid ${isOpen ? '#F4A0B0' : '#F9C5CC'}`,
      backdropFilter: 'blur(12px)',
    }}
  >
    <button onClick={onClick}
      className="w-full p-6 flex items-center justify-between text-left font-bold text-base"
      style={{ color: '#3D1520' }}>
      <span>{question}</span>
      <ChevronDown size={20} className="shrink-0 ml-4 transition-transform duration-400"
        style={{ color: '#D4617A', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 text-sm leading-relaxed font-medium pt-0"
            style={{ color: '#7A3545', borderTop: '1.5px solid #FFE8ED' }}>
            <div className="pt-5">{answer}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default Home;
