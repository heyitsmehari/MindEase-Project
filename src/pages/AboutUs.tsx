import React, { } from 'react';
import { Link } from 'react-router-dom';
import {
    Heart, Brain, Shield, Users,
    ArrowRight, CheckCircle, Zap, Globe,
    Crown, Star, Github, Linkedin, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

const SectionTag = ({ children }: { children: React.ReactNode }) => (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-5"
        style={{ background: 'rgba(212,97,122,0.10)', color: '#D4617A', border: '1px solid rgba(212,97,122,0.2)' }}>
        {children}
    </div>
);

const ValueCard = ({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) => (
    <div className="p-6 rounded-[1.8rem] group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-default"
        style={{
            background: 'rgba(255,245,247,0.5)',
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
 


const AboutUs: React.FC = () => {
    const values = [
        { icon: <Shield size={24} />, title: 'Anonymous', desc: 'Interactions on MindEase are confidential and secure. Privacy is our top priority.', color: '#7C3AED' },
        { icon: <Heart size={24} />, title: 'Student Oriented', desc: 'Built specifically for NIT Kurukshetra students, understanding the pressures of college life.', color: '#D4617A' },
        { icon: <Brain size={24} />, title: 'Science supported', desc: 'Practical tools and resources, guided by mental health research to help you feel good.', color: '#059669' },
        { icon: <Users size={24} />, title: 'Community Driven', desc: 'Strong community is formed with peer support and shared stories.', color: '#D97706' },
        { icon: <Zap size={24} />, title: 'Available 24/7', desc: '24/7 access to AI chatbot, mood tracking, and best resources.', color: '#2563EB' },
        { icon: <Globe size={24} />, title: 'Inclusive', desc: 'MindEase welcomes all students, alumni, and faculty because mental wellness matters at every stage.', color: '#EC4899' },
    ];

    const TEAM = [
        {
            id: 1,
            name: 'Priya Katariya',
            role: 'Team Leader & Full Stack Developer',
            desc: 'Visionary behind MindEase. Leads the product strategy, UI architecture, and backend integration. Passionate about mental health tech and student wellbeing.',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Priya&backgroundColor=b6e3f4',
            tags: ['React', 'TypeScript', 'Firebase', 'UI/UX'],
            github: '#', linkedin: '#', email: 'priya@mindease.edu',
            isLeader: true,
            color: '#D4617A',
            light: '#FFE8ED',
        },
        {
            id: 2,
            name: 'Arjun Sharma',
            role: 'AI & Backend Engineer',
            desc: 'Builds the AI chatbot pipeline and server logic. Specializes in NLP models and emotional intelligence systems.',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Arjun&backgroundColor=c0aede',
            tags: ['Python', 'OpenAI API', 'Node.js'],
            github: '#', linkedin: '#', email: 'arjun@mindease.edu',
            isLeader: false,
            color: '#C44A6A',
            light: '#FFE0E6',
        },
        {
            id: 3,
            name: 'Meera Nair',
            role: 'UI/UX Designer',
            desc: 'Crafts the calming, accessible interfaces that make MindEase feel warm and safe. Expert in design systems and emotional UX.',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Meera&backgroundColor=ffd5dc',
            tags: ['Figma', 'Design Systems', 'Accessibility'],
            github: '#', linkedin: '#', email: 'meera@mindease.edu',
            isLeader: false,
            color: '#EC4899',
            light: '#FCE7F3',
        },
        {
            id: 4,
            name: 'Rohan Verma',
            role: 'Database & DevOps',
            desc: 'Manages Firebase configuration, authentication flows, and deployment pipelines. Keeps the platform secure and performant.',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rohan&backgroundColor=d1fae5',
            tags: ['Firebase', 'CI/CD', 'Security'],
            github: '#', linkedin: '#', email: 'rohan@mindease.edu',
            isLeader: false,
            color: '#10B981',
            light: '#D1FAE5',
        },
        {
            id: 5,
            name: 'Kavya Reddy',
            role: 'Content & Mental Health Advisor',
            desc: 'Psychology graduate who ensures all content, resources, and bot responses are clinically informed and empathetic.',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Kavya&backgroundColor=fde68a',
            tags: ['Psychology', 'Content', 'Wellbeing'],
            github: '#', linkedin: '#', email: 'kavya@mindease.edu',
            isLeader: false,
            color: '#F59E0B',
            light: '#FEF3C7',
        },
    ];
    const leader = TEAM.find(m => m.isLeader)!;
    const members = TEAM.filter(m => !m.isLeader);

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#FFF5F7 0%,#FFE8ED 50%,#FFF0F3 100%)' }}>
            <div className="relative overflow-hidden pt-20 pb-20 px-6 text-center"
                style={{ background: 'linear-gradient(135deg,#E88FA3 0%,#D4617A 50%,#C96B84 100%)' }}>
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage:'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'}}/>
                <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl"
                style={{ background: '#FBCFE8', transform: 'translate(35%,-35%)' }} />

                <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full opacity-25 blur-3xl"
                style={{ background: '#F9A8D4', transform: 'translate(-30%,30%)' }} />

                <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] rounded-full opacity-20 blur-3xl"
                style={{ background: '#FDE2E7', transform: 'translate(-50%,-50%)' }} />
                <br/> <br/> 
                <div className="relative max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-xs font-black uppercase tracking-widest"
                        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                        About MindEase
                    </div> 
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Mental Wellness For <br/> 
                        <span className="text-pink-100"> Every NITK Student</span>
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
                            Join Free
                        </Link>
                    </div>
                </div>
            </div> 

            <div className="max-w-6xl mx-auto px-6 py-20" style={{ background: 'rgba(255,245,247,0.5)' }}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
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
                            peer communities, mentors and AI support also.
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
                    </div>
                </div>
            </div>

            <div className="py-16 px-6" style={{ background: 'rgba(255,245,247,0.5)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black" style={{ color: '#3D1520' }}>What We Stand For</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {values.map((v, i) => <ValueCard key={i} {...v} />)}
                    </div>
                </div>
            </div>

            <div id="team" className="py-20 px-6 relative" style={{ background: 'rgba(255,245,247,0.5)' }}>
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute rounded-full" style={{ width: 500, height: 500, top: '-10%', left: '-5%', background: 'radial-gradient(circle, rgba(232,133,154,0.30) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                    <div className="absolute rounded-full" style={{ width: 400, height: 400, bottom: '-10%', right: '-5%', background: 'radial-gradient(circle, rgba(236,72,153,0.20) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                </div>
                <div className="relative z-10 max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5"
                            style={{ background: 'rgba(212,97,122,0.08)', border: '1.5px solid #F4A0B0', color: '#D4617A' }}>
                            <Star size={13} className="fill-current" /> The People Behind MindEase
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-5" style={{ color: '#3D1520' }}>
                            Meet Our Team
                        </h2>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.75, delay: 0.1 }}
                        className="relative rounded-[2.5rem] p-10 md:p-14 mb-10 overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.70)', border: '2px solid rgba(212,97,122,0.30)', backdropFilter: 'blur(20px)', boxShadow: '0 24px 80px rgba(212,97,122,0.18)' }}
                    >
                        <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full hidden sm:flex"
                            style={{ background: 'linear-gradient(135deg, #D4617A, #C44A6A)', boxShadow: '0 4px 20px rgba(212,97,122,0.40)' }}>
                            <Crown size={14} className="text-white fill-current" />
                            <span className="text-white text-xs font-black uppercase tracking-widest">Team Leader</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                            <div className="relative flex-shrink-0">
                                <div className="w-44 h-44 rounded-[2rem] overflow-hidden"
                                    style={{ border: '4px solid rgba(212,97,122,0.40)', boxShadow: '0 12px 40px rgba(212,97,122,0.25)' }}>
                                    <img src={leader.avatar} alt={leader.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-lg hidden sm:flex"
                                    style={{ background: '#D4617A', boxShadow: '0 4px 16px rgba(212,97,122,0.50)' }}>
                                    👑
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl md:text-4xl font-black mb-1" style={{ color: '#3D1520' }}>{leader.name}</h2>
                                <p className="text-base font-black mb-4" style={{ color: '#D4617A' }}>{leader.role}</p>
                                <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: '#7A3545' }}>{leader.desc}</p>
                                <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                                    {leader.tags.map((t: string) => (
                                        <span key={t} className="px-3 py-1 rounded-full text-xs font-black"
                                            style={{ background: leader.light, color: leader.color, border: `1px solid ${leader.color}30` }}>{t}</span>
                                    ))}
                                </div>
                                <div className="flex gap-3 justify-center md:justify-start">
                                    {[{ icon: <Github size={16} />, href: leader.github }, { icon: <Linkedin size={16} />, href: leader.linkedin }, { icon: <Mail size={16} />, href: `mailto:${leader.email}` }].map((s, i) => (
                                        <a key={i} href={s.href}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                                            style={{ background: 'rgba(212,97,122,0.08)', border: '1.5px solid #F9C5CC', color: '#D4617A' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#D4617A'; e.currentTarget.style.color = 'white'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,97,122,0.08)'; e.currentTarget.style.color = '#D4617A'; }}
                                        >{s.icon}</a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {members.map((m, i) => (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.65, delay: 0.2 + i * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="relative rounded-[2rem] p-7 cursor-default overflow-hidden group"
                                style={{ background: 'rgba(255,255,255,0.70)', border: '1.5px solid #F9C5CC', backdropFilter: 'blur(14px)', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = m.color + '60'; e.currentTarget.style.boxShadow = `0 20px 60px ${m.color}22`; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#F9C5CC'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.05)'; }}
                            >
                                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: `linear-gradient(90deg, ${m.color}, #F4A0B0)` }} />
                                <div className="w-20 h-20 rounded-2xl overflow-hidden mb-5 mx-auto"
                                    style={{ border: `3px solid ${m.color}40`, boxShadow: `0 6px 20px ${m.color}30` }}>
                                    <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-lg font-black text-center mb-1" style={{ color: '#3D1520' }}>{m.name}</h3>
                                <p className="text-xs font-black text-center mb-3" style={{ color: m.color }}>{m.role}</p>
                                <p className="text-xs leading-relaxed text-center mb-4" style={{ color: '#7A3545', opacity: 0.80 }}>{m.desc}</p>
                                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                                    {m.tags.map((t: string) => (
                                        <span key={t} className="px-2 py-0.5 rounded-full text-[11px] font-black"
                                            style={{ background: m.light, color: m.color }}>{t}</span>
                                    ))}
                                </div>
                                <div className="flex gap-2 justify-center">
                                    {[{ icon: <Github size={13} />, href: m.github }, { icon: <Linkedin size={13} />, href: m.linkedin }, { icon: <Mail size={13} />, href: `mailto:${m.email}` }].map((s, j) => (
                                        <a key={j} href={s.href}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-xs"
                                            style={{ background: `${m.color}10`, border: `1px solid ${m.color}30`, color: m.color }}
                                            onMouseEnter={e => { e.currentTarget.style.background = m.color; e.currentTarget.style.color = 'white'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = `${m.color}10`; e.currentTarget.style.color = m.color; }}
                                        >{s.icon}</a>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black" style={{ color: '#3D1520' }}>Everything You Need</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { icon: '🤖', title: 'AI Chatbot', desc: 'AI support, anytime of the day', link: '/chatbot', color: '#7C3AED' },
                        { icon: '📊', title: 'Mood Tracker', desc: 'Daily mood tracking to understand yourself better', link: '/mood', color: '#2563EB' },
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
                                background: 'rgba(255,245,247,0.5)',
                                backdropFilter: 'blur(10px)',
                                border: '1.5px solid rgba(249,197,204,0.5)',
                            }}>
                            <div className="text-3xl mb-3 transition-transform group-hover:scale-110 inline-block">{f.icon}</div>
                            <h4 className="font-black text-sm mb-1 group-hover:transition-colors"
                                style={{ color: '#3D1520' }}>{f.title}</h4>
                            <p className="text-xs leading-relaxed" style={{ color: '#7A3545', opacity: 0.75 }}>{f.desc}</p>
                            <div className="flex items-center gap-1 mt-3 text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: f.color }}>
                                Learn more 
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        
            <div className="max-w-3xl mx-auto px-6 py-20 text-center" style={{ background: 'rgba(255,235,240,0.5)' }}>
                <SectionTag>Join MindEase</SectionTag>
                <h2 className="text-3xl font-black mb-4" style={{ color: '#3D1520' }}>
                    Your mental health matters. Start today.
                </h2>
                <p className="text-base mb-8 leading-relaxed" style={{ color: '#7A3545', opacity: 0.8 }}>
                    Join NIT Kurukshetra students and faculty who use MindEase.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Link to="/signup"
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                        style={{ background: 'linear-gradient(135deg,#D4617A,#C44A6A)', boxShadow: '0 8px 24px rgba(212,97,122,0.35)' }}>
                        Join Free Now
                    </Link>
                    <Link to="/contact"
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5"
                        style={{ border: '2px solid #F9C5CC', color: '#D4617A', background: 'rgba(255,235,240,0.6)' }}>
                        Contact Us
                    </Link>
                </div>
                <p className="text-xs mt-5" style={{ color: '#7A3545', opacity: 0.55 }}>
                    No signup fee · Good security · Cancel anytime
                </p>
            </div>
        </div>
    );
};

export default AboutUs;