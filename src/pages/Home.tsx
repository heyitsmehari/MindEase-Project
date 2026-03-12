import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle, BarChart3, Users, Heart, ArrowRight, Calendar, Video, BookOpen, Star,
  ChevronDown, ChevronLeft, ChevronRight, Award,
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MENTORS } from '../data/mentorData';
import { db } from '../firebase';
import { collection, getCountFromServer, query, where, onSnapshot } from 'firebase/firestore';

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
      { question: "Who is this platform for?", answer: "Everyone! Here at MindEase we believe that everyone deserves to have access mental well being! " },
      { question: "Is my information really anonymous?", answer: "Yes, Here at MindEase, our team truly believes in your privacy.You are never required to share any personal identity. All chats are private and encrypted!!" },
      { question: "How do I book a counseling session?", answer: "Go to the Mentor page → choose a mentor → submit an appointment request. The mentor will reply with a suitable time." },
      { question: "Is MindEase free to use?", answer: "Yes. Our website is completely free to use!" },
      { question: "Do I need an account?", answer: "No, most features work anonymously. But having an account significantly makes your website experience better, as it keeps your data stored, helps you interact with other users etc!" },
      { question: "How can I report inappropriate content in community forum?", answer: "Our dedicated team works in a very intricate manner that avoids innapropriate contents being published, however there is also a dedicated report option so that users can report inapropriate content" },
      { question: "What if I don't know what I feel?", answer: "Our team truly beleives that not everyone may know what they feel like, and that is very normal, to address this our team has a dedicated empathetic AI chat bot that understands your feelings. Feel free to book an appointment with our expert psychologists for further assistance!!" },
    ],
  },
  {
    title: "MEDITATION & MINDFULNESS",
    faqs: [
      { question: "What is meditation and mindfulness", answer: "Here at MindEase we believe that Meditation is a practice where you focus your attention and eliminate distractions to achieve a calm and clear state of mind, the outcome of which is you being fully present and aware of your thoughts which is know as Mindfulness" },
      { question: "I've never meditated before. Is that okay?", answer: "Yes! Here at MindEase we will teach you the art of meditation from the very basics!" },
      { question: "How long should I meditate?", answer: "Meditation is an art of living, but to keep up the initial motivation it is suggested to start with 25 to 30 min of daily meditation" },
      { question: "Do I need silence?", answer: "Not necessarily, however beginners find it easier to concentrate in a quite environment" },
      { question: "What if my mind keeps wandering?", answer: "That's very normal for a beginner, with practice you will be able to control your mind slowly" },
      { question: "Best time to meditate?", answer: "You can meditate whenever you want, most importantly when your mind feels heavy and exhausted, there is no specific set time to meditate!" },
      { question: "Can meditation improve focus?", answer: "Yes, it is scientifically proven that regular meditation boosts concentration." },
      { question: "Does MindEase provide classes for meditation", answer: "Yes that is one of the core essence here at MindEase, to teach people how to meditate and build an enthusiastic community that is mentally fit" },
    ],
  },
  {
    title: "STRESS & ANXIETY",
    faqs: [
      { question: "Can this help with panic attacks?", answer: "Yes. Meditation calms and relaxes your nervous system." },
      { question: "Does mood tracking really help?", answer: "Yes, organizing and keeping track of your mood helps in keeping you calm and familiar with yourself" },
      { question: "What to do during anxiety spike?", answer: "Meditate and relax, MindEase suggests to use our AI assistant to ease yourselves" },
      { question: "Why am I stressed for no reason?", answer: "This is very common, past trauma and experiences may be the reason, try connecting with one of our experts for further assistance" },
      { question: "Does sleep affect anxiety?", answer: "Yes sleep and anxiety are connected like a vicious cycle, the more anxiety you have the poorer your sleep quality, and the poorer your sleep quality the more prone to anxiety attacks you are." },
      { question: "How often track mood?", answer: "Our experts here at MindEase believes that it is best to keep track of your mood 2-3 times in a day" },
    ],
  },
  {
    title: "PRIVACY & SAFETY",
    faqs: [
      { question: "Are my conversations stored?", answer: "Your conversation are stored in our secure and encrypted database, therefore you can truly be yourselves here at MindEase!!" },
      { question: "Can others see my stories?", answer: "You can choose between anonymous and public in our website forum community, so that no one is target, as well as people can share their inspirational stories" },
      { question: "Do counselors know my identity?", answer: "No unless you share it yourself." },
      { question: "Is my data sold?", answer: "Our fundamental rule at MindEase is to never share any data, your data is encrypted and secure here and ensured that no third party accesses it" },
      { question: "Can admins read chats?", answer: "All chats with our AI assitant is private, no human can access nor read it" },
      { question: "Can I delete my data?", answer: "Yes you are given the option to delete your data completely" },
      { question: "can I share sensitive topics and past traumas here?", answer: "Yes MindEase is a safe place where you can be yourself and share your mind at!!" },
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


// ─── Feedback Marquee ─────────────────────────────────────────────────
const FeedbackMarquee: React.FC = () => {
  const [items, setItems] = React.useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'articles'), where('status', '==', 'approved'));
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((d: any) => d.type === 'feedback' && d.content);
      setItems(docs);
    });
    return () => unsub();
  }, []);

  if (items.length === 0) return null;

  const row1 = [...items, ...items, ...items];
  const row2 = [...items].reverse();
  const row2x = [...row2, ...row2, ...row2];

  const FeedCard = ({ v }: { v: any }) => (
    <div
      className="flex-shrink-0 rounded-[1.8rem] p-5 group relative overflow-hidden"
      style={{
        width: 280,
        background: 'rgba(255,255,255,0.80)',
        border: '1.5px solid #F9C5CC',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 4px 20px rgba(212,97,122,0.06)',
      }}>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(90deg,#D4617A,#F4A0B0)' }} />
      <Heart size={14} className="fill-current mb-3 opacity-50" style={{ color: '#F4A0B0' }} />
      <p className="text-sm italic leading-relaxed mb-3 line-clamp-3" style={{ color: '#3D1520' }}>
        "{v.content}"
      </p>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black truncate" style={{ color: '#D4617A' }}>
          {v.nickname || v.anonymousName || 'Anonymous'}
        </p>
        <span className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0"
          style={{ background: '#FFE8ED', color: '#C44A6A' }}>
          {v.userRole === 'alumni' ? 'Alumni' : v.userRole === 'professor' ? 'Prof' : 'Student'}
        </span>
      </div>
    </div>
  );

  return (

    <section className="py-20 overflow-hidden">
      <FadeIn>
        <div className="text-center mb-12 px-6">

          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3" style={{ color: '#3D1520' }}>
            What Our{' '}

            <span style={{ background: 'linear-gradient(135deg, #D4617A, #C44A6A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Community Says
            </span>
          </h2>
          <p className="text-sm max-w-md mx-auto font-medium" style={{ color: '#7A3545', opacity: 0.75 }}>
            Anonymous voices from students, alumni & professors — shared with care.
          </p>
        </div>
      </FadeIn>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-4" style={{ maskImage: 'linear-gradient(90deg,transparent,black 8%,black 92%,transparent)' }}>
        <div className="flex gap-4 marquee-left" style={{ width: 'max-content' }}>
          {row1.map((v, i) => <FeedCard key={`r1-${i}`} v={v} />)}
        </div>
      </div>

      {/* Row 2 — scrolls right (only if enough items) */}
      {items.length >= 2 && (
        <div className="relative" style={{ maskImage: 'linear-gradient(90deg,transparent,black 8%,black 92%,transparent)' }}>
          <div className="flex gap-4 marquee-right" style={{ width: 'max-content' }}>
            {row2x.map((v, i) => <FeedCard key={`r2-${i}`} v={v} />)}
          </div>
        </div>
      )}
    </section>
  );
};

const HERO_IMAGES = [

  'https://www.cosmos.so/e/737184541',
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=85&w=900',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=85&w=900',
  'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=85&w=900',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=900',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=85&w=900',
  'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=85&w=900',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=85&w=900'
]



// ─── HOME ─────────────────────────────────────────────────────────────
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [carouselDir, setCarouselDir] = useState(1);
  const [heroImgIdx, setHeroImgIdx] = useState(0);
  const [liveUsers, setLiveUsers] = useState<number | null>(null);
  const [liveRating, setLiveRating] = useState<string | null>(null);
  const [mentorIdx, setMentorIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setHeroImgIdx(p => (p + 1) % HERO_IMAGES.length), 3000);
    return () => clearInterval(t);
  }, []);

  // Fetch live user count from Firestore
  useEffect(() => {
    getCountFromServer(collection(db, 'users'))
      .then(s => setLiveUsers(s.data().count))
      .catch(() => { });
  }, []);

  // Fetch live average rating from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'ratings'), snap => {
      const vals = snap.docs.map(d => (d.data() as any).rating as number).filter(Boolean);
      if (vals.length) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        setLiveRating(avg.toFixed(1) + '★');
      }
    }, () => { });
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
            { color: 'rgba(255, 147, 170, 0.67)', w: 380, h: 380, top: '2%', left: '5%', xA: [0, 50, 0], yA: [0, 35, 0], dur: 18, delay: 0 },
            { color: 'rgba(255, 205, 231, 0.57)', w: 300, h: 300, top: '58%', left: '1%', xA: [0, -30, 0], yA: [0, -25, 0], dur: 22, delay: 2 },
            { color: 'hsla(325, 100%, 81%, 0.52)', w: 340, h: 340, top: '10%', left: '68%', xA: [0, -40, 0], yA: [0, 30, 0], dur: 20, delay: 1 },
            { color: 'rgba(254, 122, 206, 0.59)', w: 240, h: 240, top: '68%', left: '78%', xA: [0, 25, 0], yA: [0, -35, 0], dur: 25, delay: 3 },
            { color: 'rgba(255, 110, 187, 0.43)', w: 220, h: 220, top: '42%', left: '45%', xA: [0, 22, 0], yA: [0, 22, 0], dur: 16, delay: 1.5 },
            { color: 'rgba(212, 97, 122, 0.46)', w: 280, h: 280, top: '75%', left: '32%', xA: [0, -28, 0], yA: [0, 18, 0], dur: 21, delay: 0.8 },
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
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-4 tracking-tighter"
                style={{ color: '#3D1520' }}
              >
                Your Mind Deserves <br />
                <span style={{
                  background: 'linear-gradient(135deg, #D4617A 0%, #F472B6 50%, #BE185D 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  To Be Seen, Heard & Healed
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="text-lg md:text-2xl font-light leading-relaxed mb-9 max-w-2xl italic"
                style={{ color: '#7A3545' }}
              >
                Heavy days don't have to be handled alone. Whether it’s academic burnout or personal storms,
                this is your <span className="font-semibold text-[#D4617A]">judgment-free sanctuary</span> to breathe and rebuild.
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
                    label: 'Registered Members', color: '#D4617A',
                  },
                  { value: liveRating || '4.9★', label: 'Community Rating', color: '#EC4899', live: false },
                  { value: '24/7', label: 'Safe Support Access', color: '#10B981', live: false },
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

            {/* ── RIGHT: 3D cycling image card ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex items-center justify-center relative h-[520px]"
            >

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
        <section className="px-6 py-24 bg-gradient-to-b from-[#FFF6F8] via-white to-white relative overflow-hidden">

          {/* Soft background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#FFE8ED_0%,_transparent_70%)] opacity-40 pointer-events-none" />

          <FadeIn>

            {/* Section Heading */}
            <div className="text-center mb-16 relative z-10">


              <h2 className="text-4xl md:text-5xl font-black text-[#2E1A22] mb-5 tracking-tight">
                A Space Where <span className="text-[#D4617A]">You Truly Matter</span>
              </h2>

              <p className="text-[#7A3545] max-w-xl mx-auto text-lg md:text-xl font-medium leading-relaxed opacity-80">
                Whether you're feeling overwhelmed, confused, unmotivated, or simply need clarity —
                these tools are here to support you gently, privately, and without judgment.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">

              {/* AI Support Card */}
              <div className="group p-8 rounded-[2.5rem] bg-white border border-[#FFE8ED] shadow-[0_8px_30px_rgb(212,97,122,0.04)] hover:shadow-[0_20px_40px_rgb(212,97,122,0.1)] hover:-translate-y-2 transition-all duration-500">

                <div className="w-14 h-14 rounded-2xl bg-[#FFE8ED] flex items-center justify-center text-[#D4617A] mb-7 group-hover:scale-110 transition-transform">
                  <MessageCircle size={30} strokeWidth={2.5} />
                </div>

                <h3 className="text-2xl font-bold text-[#2E1A22] mb-3">AI Support</h3>

                <p className="text-[#7A3545] leading-relaxed mb-6 font-medium opacity-90">
                  Some days feel heavy. Some thoughts are hard to say out loud.
                  Talk freely with our empathetic AI — available anytime you need comfort, clarity, or simply someone who listens.
                </p>

                <a href="/chatbot" className="inline-flex items-center font-bold text-[#C44A6A] gap-2 text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                  Start Talking <ArrowRight size={18} />
                </a>
              </div>

              {/* Mood Tracker Card */}
              <div className="group p-8 rounded-[2.5rem] bg-white border border-[#FFE8ED] shadow-[0_8px_30px_rgb(196,74,106,0.04)] hover:shadow-[0_20px_40px_rgb(196,74,106,0.1)] hover:-translate-y-2 transition-all duration-500">

                <div className="w-14 h-14 rounded-2xl bg-[#FFE0E6] flex items-center justify-center text-[#C44A6A] mb-7 group-hover:scale-110 transition-transform">
                  <BarChart3 size={30} strokeWidth={2.5} />
                </div>

                <h3 className="text-2xl font-bold text-[#2E1A22] mb-3">Mood Tracker</h3>

                <p className="text-[#7A3545] leading-relaxed mb-6 font-medium opacity-90">
                  Your emotions tell a story. Track how you feel each day, discover patterns over time,
                  and gain gentle insights into what truly lifts you up-and what weighs you down.
                </p>

                <a href="/mood" className="inline-flex items-center font-bold text-[#C44A6A] gap-2 text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                  See Your Journey <ArrowRight size={18} />
                </a>
              </div>

              {/* Student Stories Card */}
              <div className="group p-8 rounded-[2.5rem] bg-white border border-[#FFE8ED] shadow-[0_8px_30px_rgb(232,146,165,0.04)] hover:shadow-[0_20px_40px_rgb(232,146,165,0.1)] hover:-translate-y-2 transition-all duration-500">

                <div className="w-14 h-14 rounded-2xl bg-[#FFE0E6] flex items-center justify-center text-[#C44A6A] mb-7 group-hover:scale-110 transition-transform">
                  <Users size={30} strokeWidth={2.5} />
                </div>

                <h3 className="text-2xl font-bold text-[#2E1A22] mb-3">Student Stories</h3>

                <p className="text-[#7A3545] leading-relaxed mb-6 font-medium opacity-90">
                  You’re not alone — even when it feels like you are.
                  Read honest, anonymous journeys from fellow students, and share yours when you're ready to inspire someone else.
                </p>

                <a href="/stories" className="inline-flex items-center font-bold text-[#C44A6A] gap-2 text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                  Discover Stories <ArrowRight size={18} />
                </a>
              </div>

            </div>

          </FadeIn>
        </section>

        {/* ══ QUOTE MARQUEE CAROUSEL ════════════════════════ */}
        <section className="py-20 overflow-hidden">
          <FadeIn>
            <div className="text-center mb-14 px-6">

              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: '#3D1520' }}>
                Words That{' '}
                <span style={{ background: 'linear-gradient(135deg, #D4617A, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Restore You
                </span>
              </h2>
              <p className="text-base font-medium max-w-lg mx-auto" style={{ color: '#7A3545', opacity: 0.75 }}>
                Gentle reminders from people who've been there — because you deserve to know you're not broken, just human.
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

        

        {/* ══ MENTOR CAROUSEL ══════════════════════════════ */}
        <section className="py-20 px-6">
          <FadeIn>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                
                <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: '#3D1520' }}>Meet Your Guides</h2>
                <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: '#7A3545' }}>
                  Compassionate mentors who understand student life — here to listen, guide, and walk alongside you.
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

        {/* ══ COMMUNITY FEEDBACK VOICES ═════════════════════ */}
        <section className="bg-[#FFF5F7]">
        <FeedbackMarquee />
        </section>

        {/* ══ FAQ ══════════════════════════════════════════ */}

        <section className="py-20 px-6">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight" style={{ color: '#3D1520' }}>Got Questions? <span style={{ background: 'linear-gradient(135deg, #D4617A, #C44A6A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>We've Got Answers.</span></h2>
                <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: '#7A3545', opacity: 0.7 }}>Everything you've been wondering about MindEase — answered honestly and openly.</p>
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



              <div className="relative z-10 px-8 py-20">

                <motion.h2
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1 }}
                  className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight tracking-tight"
                >
                  Your Healing{' '}
                  <span style={{ background: 'linear-gradient(135deg, #F9C5CC, #FFE8ED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Starts Here.
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                >
                  Don't carry it alone. Thousands of students have already taken their first step with MindEase — and every single one says it was worth it. Today could be your day too.
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
                    Book Your Free Session →
                  </button>
                  <button onClick={() => navigate('/chatbot')}
                    className="px-10 py-5 font-bold text-white text-lg rounded-2xl transition-all active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.35)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.26)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  >
                    Chat with AI Support
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
