import React, { } from 'react';
import { Link } from 'react-router-dom';
import {
    Heart, Brain, Shield, Users,
    ArrowRight, CheckCircle, Zap, Globe,
} from 'lucide-react';

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
 
const TeamCard = ({ name, role, desc, emoji, gradient }: {
    name: string; role: string; desc: string; emoji: string; gradient: string;
}) => (
    <div className="p-6 rounded-[1.8rem] text-center group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        style={{
            background: 'rgba(255,245,247,0.5)',
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

const AboutUs: React.FC = () => {
    const values = [
        { icon: <Shield size={24} />, title: 'Anonymous', desc: 'Interactions on MindEase are confidential and secure. Privacy is our top priority.', color: '#7C3AED' },
        { icon: <Heart size={24} />, title: 'Student Oriented', desc: 'Built specifically for NIT Kurukshetra students, understanding the pressures of college life.', color: '#D4617A' },
        { icon: <Brain size={24} />, title: 'Science supported', desc: 'Practical tools and resources, guided by mental health research to help you feel good.', color: '#059669' },
        { icon: <Users size={24} />, title: 'Community Driven', desc: 'Strong community is formed with peer support and shared stories.', color: '#D97706' },
        { icon: <Zap size={24} />, title: 'Available 24/7', desc: '24/7 access to AI chatbot, mood tracking, and best resources.', color: '#2563EB' },
        { icon: <Globe size={24} />, title: 'Inclusive', desc: 'MindEase welcomes all students, alumni, and faculty because mental wellness matters at every stage.', color: '#EC4899' },
    ];

    const team = [
        { name: 'Priya', role: 'Team leader', desc: 'Student at NIT KKR in IT branch.', emoji: '👩‍🏫', gradient: 'linear-gradient(135deg,#FFF5F7,#FFE8ED)' },
        { name: 'Amica Aggarwal', role: 'Developer', desc: 'Student at NIT KKR in IT branch.', emoji: '🎨', gradient: 'linear-gradient(135deg,#FDF4FF,#FAE8FF)' },
        { name: 'Trishna', role: 'Developer', desc: 'Student at NIT KKR in IT branch.', emoji: '📝', gradient: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)' },
        { name: 'Hari ram Chhembra', role: 'Developer', desc: 'Student at NIT KKR in IT branch.', emoji: '🧠', gradient: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)' },
        { name: 'Krishna Kumar', role: 'Developer', desc: 'Student at NIT KKR in IT branch.', emoji: '🤝', gradient: 'linear-gradient(135deg,#FFF5F7,#FCE7F3)' },
    ];

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

            <div className="py-20 px-6" style={{ background: 'rgba(255,245,247,0.5)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black mb-3" style={{ color: '#3D1520' }}>The People Behind MindEase</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
                        {team.map((t, i) => <TeamCard key={i} {...t} />)}
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