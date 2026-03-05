import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Heart, Brain, Shield, Users, Star,
    Sparkles, GraduationCap, Award, Mail,
    ArrowRight, CheckCircle, Zap, Globe,
} from 'lucide-react';

// ── Animated Counter ──
const Counter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 1800;
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [end]);
    return <>{count.toLocaleString()}{suffix}</>;
};

// ── Section Header ──
const SectionTag = ({ children }: { children: React.ReactNode }) => (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-5"
        style={{ background: 'rgba(212,97,122,0.10)', color: '#D4617A', border: '1px solid rgba(212,97,122,0.2)' }}>
        <Sparkles size={12} /> {children}
    </div>
);

// ── Value Card ──
const ValueCard = ({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) => (
    <div className="p-6 rounded-[1.8rem] group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-default"
        style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(249,197,204,0.5)',
            boxShadow: '0 4px 20px rgba(212,97,122,0.07)',
        }}>
        <div className="inline-flex p-4 rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${color} 15` }}>
            <span style={{ color }}>{icon}</span>
        </div>
        <h3 className="font-black text-lg mb-2" style={{ color: '#3D1520' }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: '#7A3545', opacity: 0.8 }}>{desc}</p>
    </div>
); 
 
// ── Team Member Card ──
const TeamCard = ({ name, role, desc, emoji, gradient }: {
    name: string; role: string; desc: string; emoji: string; gradient: string;
}) => (
    <div className="p-6 rounded-[1.8rem] text-center group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        style={{
            background: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(249,197,204,0.5)',
            boxShadow: '0 4px 20px rgba(212,97,122,0.07)',
        }}>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 shadow-lg"
            style={{ background: gradient }}>
            {emoji}
        </div>
        <h4 className="font-black text-base mb-0.5" style={{ color: '#3D1520' }}>{name}</h4>
        <p className="text-[11px] font-black uppercase tracking-wider mb-2" style={{ color: '#D4617A' }}>{role}</p>
        <p className="text-xs leading-relaxed" style={{ color: '#7A3545', opacity: 0.75 }}>{desc}</p>
    </div>
);

// ── Main Component ──
const AboutUs: React.FC = () => {
    const stats = [
        { n: 300, s: '+', label: 'Students Helped', icon: '🧑‍🎓' },
        { n: 20, s: '+', label: 'Mentors & Experts', icon: '👨‍⚕️' },
        { n: 500, s: '+', label: 'Sessions Completed', icon: '💬' },
        { n: 95, s: '%', label: 'Satisfaction Rate', icon: '⭐' },
    ];
 
    const values = [
        { icon: <Shield size={24} />, title: 'Safe & Anonymous', desc: 'Interactions on MindEase are confidential and secure. Privacy is our top priority.', color: '#7C3AED' },
        { icon: <Heart size={24} />, title: 'Student Oriented', desc: 'Built specifically for NIT Kurukshetra students, understanding the pressures of college life.', color: '#D4617A' },
        { icon: <Brain size={24} />, title: 'Science supported', desc: 'Practical tools and resources, guided by mental health research to help you feel good.', color: '#059669' },
        { icon: <Users size={24} />, title: 'Community Driven', desc: 'Strong community is formed with peer support and shared stories.', color: '#D97706' },
        { icon: <Zap size={24} />, title: 'Available 24/7', desc: '24/7 access to AI chatbot, mood tracking, and best resources.', color: '#2563EB' },
        { icon: <Globe size={24} />, title: 'Inclusive', desc: 'MindEase welcomes all students, alumni, and faculty because mental wellness matters at every stage.', color: '#EC4899' },
    ];

    const team = [
        { name: 'Dr. Priya', role: 'Faculty Advisor', desc: 'Assistant Professor in Psychology, NIT Kurukshetra. 12+ years in student counseling.', emoji: '👩‍🏫', gradient: 'linear-gradient(135deg,#FFF5F7,#FFE8ED)' },
        { name: 'Arav Mehta', role: 'Lead Developer', desc: 'CSE final year student passionate about tech for social good. Built MindEase from scratch.', emoji: '👨‍💻', gradient: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)' },
        { name: 'Amica Aggarwal', role: 'UX Designer', desc: 'Makes MindEase feel warm and human. ECE student with a love for accessible design.', emoji: '🎨', gradient: 'linear-gradient(135deg,#FDF4FF,#FAE8FF)' },
        { name: 'Trishna', role: 'Content Curator', desc: 'Researches and crafts every resource, article, and guide on the platform.', emoji: '📝', gradient: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)' },
        { name: 'Hari ram Chhembra', role: 'Mental Health Expert', desc: 'Certified therapist and wellness coach. Reviews all clinical content on the platform.', emoji: '🧠', gradient: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)' },
        { name: 'Krishna Kumar', role: 'Community Lead', desc: 'MSc student managing peer support groups and alumni mentorship programmes.', emoji: '🤝', gradient: 'linear-gradient(135deg,#FFF5F7,#FCE7F3)' },
    ];

    const milestones = [
        { year: '2023', title: 'MindEase Founded', desc: 'Started as a small project during a hackathon at NIT Kurukshetra to help stressed students.', icon: '🌱' },
        { year: 'Jan 2024', title: 'First 50 Users', desc: 'Crossed 50 active users within the first month, inside NITK campus.', icon: '🚀' },
        { year: 'Jun 2024', title: 'Mentor Network', desc: 'Launched the mentor matchmaking feature connecting students with alumni and faculty.', icon: '🤝' },
        { year: 'Sep 2024', title: 'AI Chatbot', desc: 'Introduced round-the-clock AI-powered emotional support chatbot.', icon: '🤖' },
        { year: 'Jan 2025', title: 'Events & Alumni Hub', desc: 'Opened events platform — professors and alumni can now post events and workshops.', icon: '📅' },
        { year: '2026', title: '500+ Students', desc: 'MindEase now actively supports 500+ students across NIT Kurukshetra.', icon: '🎓' },
    ];

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#FFF5F7 0%,#FFE8ED 50%,#FFF0F3 100%)' }}>
            {/* ── Hero ── */}
            <div className="relative overflow-hidden pt-28 pb-32 px-6 text-center"
                style={{ background: 'linear-gradient(135deg,#D4617A 0%,#C44A6A 40%,#9B2C5A 100%)' }}>
                {/* Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'white', transform: 'translate(30%,-30%)' }} />
                <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10"
                    style={{ background: 'white', transform: 'translate(-25%,30%)' }} />
                <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-5"
                    style={{ background: 'white', transform: 'translate(-50%,-50%)' }} />

                <div className="relative max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-xs font-black uppercase tracking-widest"
                        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                        <Brain size={14} /> About MindEase
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Mental Wellness for<br />
                        <span className="text-pink-100">Every NITK Student</span>
                    </h1>
                    <p className="text-white/75 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        MindEase is a safe place built with love at NIT Kurukshetra. Its aim is to help students, alumni, and faculty with the emotional challenges of college life.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link to="/sessions"
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                            style={{ background: 'white', color: '#D4617A' }}>
                            Explore Sessions <ArrowRight size={16} />
                        </Link>
                        <Link to="/signup"
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                            Join Free <Sparkles size={16} />
                        </Link>
                    </div>
                </div>
            </div> 
   
            {/* ── Stats ── */}
            <div className="max-w-5xl mx-auto px-6 -mt-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <div key={i}
                            className="p-6 rounded-[2rem] text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
                            style={{
                                background: 'rgba(255,255,255,0.82)',
                                backdropFilter: 'blur(12px)',
                                border: '1.5px solid rgba(249,197,204,0.6)',
                                boxShadow: '0 8px 32px rgba(212,97,122,0.10)',
                            }}>
                            <div className="text-2xl mb-2">{s.icon}</div>
                            <p className="text-3xl font-black" style={{ color: '#D4617A' }}>
                                <Counter end={s.n} suffix={s.s} />
                            </p>
                            <p className="text-[10px] uppercase font-black mt-1 tracking-wider" style={{ color: '#7A3545', opacity: 0.7 }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Mission ── */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <SectionTag>Our Mission</SectionTag>
                        <h2 className="text-4xl font-black mb-6 leading-tight" style={{ color: '#3D1520' }}>
                            Breaking the stigma,<br />
                            <span style={{ color: '#D4617A' }}>one conversation at a time.</span>
                        </h2>
                        <p className="text-base leading-relaxed mb-6" style={{ color: '#7A3545', opacity: 0.85 }}>
                            Engineering college can be tough. Assignments, placements, relationships, family pressure, inside struggles, 
                            within all this, mental health gets pushed aside in the corner. MindEase was created to help regulate mental health.
                        </p>
                        <p className="text-base leading-relaxed mb-8" style={{ color: '#7A3545', opacity: 0.85 }}>
                            We provide students with anonymous and non judgemental access to mental health tools,
                            peer communities, professional mentors and also, AI driven support.
                        </p> 
                        <div className="space-y-3"> 
                            {[ 
                                'Free for all NIT KKR students',
                                'Anonymous, no one knows who you are',
                                'Sessions with professional mentors',
                                'AI chatbot, available 24/7',
                            ].map((point, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle size={18} style={{ color: '#D4617A', flexShrink: 0 }} />
                                    <p className="text-sm font-medium" style={{ color: '#3D1520' }}>{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Card */}
                    <div className="relative">
                        <div className="rounded-[2.5rem] p-8 text-center"
                            style={{
                                background: 'linear-gradient(135deg,rgba(212,97,122,0.08),rgba(196,74,106,0.12))',
                                border: '2px solid rgba(249,197,204,0.6)',
                                backdropFilter: 'blur(12px)',
                            }}>
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-[2rem] flex items-center justify-center text-6xl shadow-2xl mx-auto"
                                    style={{ background: 'linear-gradient(135deg,#D4617A,#C44A6A)' }}>
                                    🧠
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                                    style={{ background: '#FFF5F7', border: '2px solid #F9C5CC' }}>💜</div>
                            </div>
                            <h3 className="text-2xl font-black mb-3" style={{ color: '#3D1520' }}>Your Safe Space</h3>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: '#7A3545', opacity: 0.8 }}>
                                "Always know that you are not alone. MindEase is here whenever you need to confide in, or just vent freely."
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { icon: '💬', label: 'Talk' },
                                    { icon: '📊', label: 'Track' },
                                    { icon: '🌱', label: 'Grow' },
                                ].map((item, i) => (
                                    <div key={i} className="rounded-2xl p-3 text-center"
                                        style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(249,197,204,0.4)' }}>
                                        <div className="text-2xl mb-1">{item.icon}</div>
                                        <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#D4617A' }}>{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Floating badges */}
                        <div className="absolute -top-4 -left-4 px-3 py-2 rounded-xl text-xs font-black"
                            style={{ background: 'linear-gradient(135deg,#D4617A,#C44A6A)', color: 'white', boxShadow: '0 4px 16px rgba(212,97,122,0.35)' }}>
                            🔒 100% Anonymous
                        </div>
                        <div className="absolute -bottom-4 -right-4 px-3 py-2 rounded-xl text-xs font-black"
                            style={{ background: 'white', color: '#059669', border: '2px solid #BBF7D0', boxShadow: '0 4px 16px rgba(5,150,105,0.15)' }}>
                            ✅ Completely Free
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Values ── */}
            <div className="py-16 px-6" style={{ background: 'rgba(255,245,247,0.5)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <SectionTag>Our Values</SectionTag>
                        <h2 className="text-3xl font-black" style={{ color: '#3D1520' }}>What We Stand For</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {values.map((v, i) => <ValueCard key={i} {...v} />)}
                    </div>
                </div>
            </div>

            {/* ── Story / Journey ── */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <SectionTag>Our Journey</SectionTag>
                    <h2 className="text-3xl font-black" style={{ color: '#3D1520' }}>How MindEase Grew</h2>
                </div>
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 hidden md:block"
                        style={{ background: 'linear-gradient(to bottom, #F9C5CC, transparent)' }} />
                    <div className="space-y-8">
                        {milestones.map((m, i) => (
                            <div key={i} className={`flex gap - 6 items - start ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} `}>
                                <div className={`flex - 1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} `}>
                                    <div className="p-5 rounded-[1.5rem] inline-block max-w-sm transition-all duration-300 hover:shadow-lg"
                                        style={{
                                            background: 'rgba(255,255,255,0.82)',
                                            backdropFilter: 'blur(12px)',
                                            border: '1.5px solid rgba(249,197,204,0.5)',
                                        }}>
                                        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#D4617A' }}>{m.year}</p>
                                        <h4 className="font-black text-sm mb-1" style={{ color: '#3D1520' }}>{m.title}</h4>
                                        <p className="text-xs leading-relaxed" style={{ color: '#7A3545', opacity: 0.8 }}>{m.desc}</p>
                                    </div>
                                </div>
                                {/* Center dot */}
                                <div className="hidden md:flex w-12 h-12 rounded-2xl items-center justify-center text-xl flex-shrink-0 shadow-md"
                                    style={{ background: 'linear-gradient(135deg,#D4617A,#C44A6A)', zIndex: 1 }}>
                                    {m.icon}
                                </div>
                                <div className="flex-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Team ── */}
            <div className="py-16 px-6" style={{ background: 'rgba(255,245,247,0.5)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <SectionTag>Our Team</SectionTag>
                        <h2 className="text-3xl font-black mb-3" style={{ color: '#3D1520' }}>The People Behind MindEase</h2>
                        <p className="text-sm max-w-lg mx-auto" style={{ color: '#7A3545', opacity: 0.75 }}>
                            Students, faculty, and mental health professionals working together to support NIT Kurukshetra.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {team.map((t, i) => <TeamCard key={i} {...t} />)}
                    </div>
                </div>
            </div>

            {/* ── Features ── */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <SectionTag>Platform Features</SectionTag>
                    <h2 className="text-3xl font-black" style={{ color: '#3D1520' }}>Everything You Need</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { icon: '🤖', title: 'AI Chatbot', desc: '24/7 support, anytime of the day', link: '/chatbot', color: '#7C3AED' },
                        { icon: '📊', title: 'Mood Tracker', desc: 'Daily mood tracking to understand youself better', link: '/mood', color: '#2563EB' },
                        { icon: '👥', title: 'Mentor Connect', desc: 'Book 1 on 1 sessions with alumni and mentors', link: '/mentor', color: '#D4617A' },
                        { icon: '📅', title: 'Events', desc: 'Workshops and events by professors & alumni', link: '/events', color: '#D97706' },
                        { icon: '🏘️', title: 'Community', desc: 'Anonymous peer discussions support', link: '/community', color: '#059669' },
                        { icon: '📚', title: 'Resources', desc: 'Curated mental health books, and videos', link: '/resources', color: '#EC4899' },
                        { icon: '💆', title: 'Wellness Hub', desc: 'Video therapy sessions and bookable appointments', link: '/sessions', color: '#0891B2' },
                        { icon: '🚨', title: 'Emergency', desc: 'Access to helplines and support in case of emergency', link: '/emergency', color: '#DC2626' },
                    ].map((f, i) => (
                        <Link key={i} to={f.link}
                            className="p-5 rounded-[1.5rem] group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl block"
                            style={{
                                background: 'rgba(255,255,255,0.78)',
                                backdropFilter: 'blur(10px)',
                                border: '1.5px solid rgba(249,197,204,0.5)',
                            }}>
                            <div className="text-3xl mb-3 transition-transform group-hover:scale-110 inline-block">{f.icon}</div>
                            <h4 className="font-black text-sm mb-1 group-hover:transition-colors"
                                style={{ color: '#3D1520' }}>{f.title}</h4>
                            <p className="text-xs leading-relaxed" style={{ color: '#7A3545', opacity: 0.75 }}>{f.desc}</p>
                            <div className="flex items-center gap-1 mt-3 text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: f.color }}>
                                Learn more <ArrowRight size={11} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Achievements ── */}
            <div className="py-16 px-6"
                style={{ background: 'linear-gradient(135deg,#D4617A 0%,#C44A6A 40%,#9B2C5A 100%)' }}>
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-black uppercase tracking-widest"
                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}>
                        <Award size={12} /> Recognitions & Milestones
                    </div>
                    <h2 className="text-3xl font-black text-white mb-10">Making a Difference at NITK</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: '🏆', title: 'Hackathon Winner', desc: '1st place at NITK Internal Hackathon 2023 for Social Impact' },
                            { icon: '📰', title: 'Featured in Campus Newsletter', desc: 'Recognized by NIT Kurukshetra student welfare committee' },
                            { icon: '🌟', title: '4.3 Student Rating', desc: 'Consistently rated over 4.3/5 by active MindEase users' },
                        ].map((a, i) => (
                            <div key={i} className="p-6 rounded-[1.8rem] text-center"
                                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <div className="text-4xl mb-3">{a.icon}</div>
                                <h4 className="font-black text-white mb-2">{a.title}</h4>
                                <p className="text-white/70 text-sm leading-relaxed">{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CTA ── */}
            <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                <SectionTag>Join MindEase</SectionTag>
                <h2 className="text-3xl font-black mb-4" style={{ color: '#3D1520' }}>
                    Your mental health matters. Start today.
                </h2>
                <p className="text-base mb-8 leading-relaxed" style={{ color: '#7A3545', opacity: 0.8 }}>
                    Join 300+ NIT Kurukshetra students and faculty who use MindEase.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Link to="/signup"
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                        style={{ background: 'linear-gradient(135deg,#D4617A,#C44A6A)', boxShadow: '0 8px 24px rgba(212,97,122,0.35)' }}>
                        <GraduationCap size={18} /> Join Free Now
                    </Link>
                    <Link to="/contact"
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5"
                        style={{ border: '2px solid #F9C5CC', color: '#D4617A', background: 'white' }}>
                        <Mail size={18} /> Contact Us
                    </Link>
                </div>
                <p className="text-xs mt-5" style={{ color: '#7A3545', opacity: 0.55 }}>
                    <Star size={10} className="inline mr-1" /> No signup fee · No personal data shared · Cancel anytime
                </p>
            </div>

        </div>
    );
};

export default AboutUs;
