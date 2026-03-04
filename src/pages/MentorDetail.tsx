import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Star, Clock, Users, Award, Briefcase,
    Mail, CheckCircle, X, Heart, Send, AlertCircle
} from 'lucide-react';
import { MENTORS } from '../data/mentorData';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojnbgzy';

// ─── Appointment Modal ────────────────────────────────────────────────
interface ModalProps {
    mentorName: string;
    mentorEmail: string;
    onClose: () => void;
}

const AppointmentModal: React.FC<ModalProps> = ({ mentorName, mentorEmail, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [concern, setConcern] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !concern.trim()) return;
        setStatus('loading');
        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    _replyto: email.trim(),
                    _subject: `📅 Mentor Appointment Request — ${name.trim()} → ${mentorName}`,
                    Student_Name: name.trim(),
                    Student_Email: email.trim(),
                    Mentor_Name: mentorName,
                    Mentor_Email: mentorEmail,
                    Message: `
New mentor appointment request via MindEase:

Student: ${name.trim()}
Email:   ${email.trim()}
Mentor:  ${mentorName} (${mentorEmail})

Concern:
${concern.trim()}

Please reply to ${email.trim()} with available time slots.
— MindEase
                    `.trim(),
                }),
            });
            if (!res.ok) throw new Error('Failed to send. Please try again.');
            setStatus('success');
        } catch (err: any) {
            console.error('Appointment request error:', err);
            setErrorMsg(err?.message || 'Something went wrong. Please try again or contact support.');
            setStatus('error');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(75, 38, 60, 0.5)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 40 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
                style={{ background: '#fff1f8', border: '2px solid #fed6f0' }}
            >
                {/* Header */}
                <div className="px-8 pt-8 pb-10 text-white"
                    style={{ background: 'linear-gradient(135deg, #D4617A, #ec849a)' }}>
                    <button onClick={onClose}
                        className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-all"
                        style={{ background: 'rgba(255,255,255,0.20)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.20)'}
                    >
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.18)' }}>
                            <Mail size={18} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-white/75">Request Appointment</span>
                    </div>
                    <h2 className="text-2xl font-black leading-tight">
                        Book a Session with<br />{mentorName}
                    </h2>
                    <p className="text-white/70 text-sm mt-2 leading-relaxed">
                        Submit your request — {mentorName.split(' ')[0]} will review it and reply with a suitable time.
                    </p>
                </div>

                {/* Body */}
                <div className="-mt-5 rounded-t-[2rem] px-8 pb-8 pt-6" style={{ background: '#F4F1FF' }}>
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                                    style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.25)' }}>
                                    <CheckCircle size={40} className="text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-black mb-3" style={{ color: '#fb9cb0' }}>Request Sent! 🎉</h3>
                                <p className="leading-relaxed mb-6 text-sm" style={{ color: '#79051e' }}>
                                    Your appointment request has been sent to <strong>{mentorName}</strong>. They will review your message and reach out with a suitable time. Check your inbox soon!
                                </p>
                                <button onClick={onClose}
                                    className="px-8 py-3 text-white font-bold rounded-2xl transition-all"
                                    style={{ background: 'linear-gradient(135deg, #D4617A, #ec849a)' }}>
                                    Done
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
                                {status === 'error' && (
                                    <div className="flex items-start gap-3 p-4 rounded-2xl text-sm"
                                        style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239, 68, 154, 0.25)', color: '#DC2626' }}>
                                        <AlertCircle size={17} className="shrink-0 mt-0.5" />
                                        <span>{errorMsg}</span>
                                    </div>
                                )}

                                {[
                                    { label: 'Your Name', value: name, setValue: setName, type: 'text', placeholder: 'Enter your full name' },
                                    { label: 'Your Email', value: email, setValue: setEmail, type: 'email', placeholder: 'your.email@example.com' },
                                ].map(({ label, value, setValue, type, placeholder }) => (
                                    <div key={label}>
                                        <label className="text-sm font-bold mb-1.5 block" style={{ color: '#4b263f' }}>{label}</label>
                                        <input type={type} value={value} onChange={e => setValue(e.target.value)}
                                            placeholder={placeholder} required
                                            className="w-full px-4 py-3.5 rounded-2xl outline-none transition-all text-sm"
                                            style={{ background: 'rgba(255,255,255,0.80)', border: '1.5px solid #fed6f0', color: '#7e152c' }}
                                            onFocus={e => { e.target.style.borderColor = '#D4617A'; e.target.style.boxShadow = '0 0 0 3px rgba(237, 58, 168, 0.15)'; }}
                                            onBlur={e => { e.target.style.borderColor = '#fed6f0'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="text-sm font-bold mb-1.5 block" style={{ color: '#4b263f' }}>What would you like to discuss?</label>
                                    <textarea value={concern} onChange={e => setConcern(e.target.value)}
                                        placeholder="Briefly describe what's on your mind. The more context you give, the better the mentor can prepare..."
                                        required rows={4}
                                        className="w-full px-4 py-3.5 rounded-2xl outline-none resize-none transition-all text-sm"
                                        style={{ background: 'rgba(255,255,255,0.80)', border: '1.5px solid #fed6f0', color: '#7e152c' }}
                                        onFocus={e => { e.target.style.borderColor = '#D4617A'; e.target.style.boxShadow = '0 0 0 3px rgba(236, 60, 116, 0.15)'; }}
                                        onBlur={e => { e.target.style.borderColor = '#fed6e1'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-2xl text-sm"
                                    style={{ background: 'rgba(124,58,237,0.07)', border: '1.5px solid #fed6f0', color: '#D4617A' }}>
                                    <Clock size={16} className="shrink-0 mt-0.5" />
                                    <span>
                                        <strong>No time selection needed.</strong> {mentorName.split(' ')[0]} will decide the best meeting time and confirm it directly to your email.
                                    </span>
                                </div>

                                <button type="submit" disabled={status === 'loading'}
                                    className="w-full py-4 font-black text-white rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                                    style={{ background: 'linear-gradient(135deg, #D4617A, #ec8ba0)', boxShadow: '0 8px 30px rgba(237, 58, 139, 0.3)' }}
                                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 45px rgba(237, 58, 139, 0.50)')}
                                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 8px 30px rgba(237, 58, 139, 0.30)')}
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-5 h-5 rounded-full border-2"
                                                style={{ borderColor: 'rgba(255,255,255,0.30)', borderTopColor: 'white' }} />
                                            Sending Request...
                                        </>
                                    ) : (
                                        <><Send size={18} /> Send Appointment Request</>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── MentorDetail Page ────────────────────────────────────────────────
const MentorDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const mentor = MENTORS.find((m) => m.id === Number(id));

    if (!mentor) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#fff1fb' }}>
                <div className="text-center">
                    <h2 className="text-3xl font-black mb-4" style={{ color: '#4b2632' }}>Mentor not found</h2>
                    <button onClick={() => navigate('/mentor')} className="font-bold underline" style={{ color: '#D4617A' }}>
                        Back to Mentors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ background: '#fff1fc' }}>

                {/* Ambient orbs */}
                <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(255, 193, 219, 0.4) 0%, transparent 70%)' }} />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(250, 139, 169, 0.25) 0%, transparent 70%)' }} />
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Back */}
                    <motion.button
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 font-bold mb-8 group transition-all"
                        style={{ color: '#D4617A' }}
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </motion.button>

                    <div className="grid md:grid-cols-[340px_1fr] gap-8">

                        {/* LEFT */}
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
                            {/* Image */}
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white"
                                style={{ boxShadow: '0 20px 60px rgba(237, 58, 121, 0.18)' }}>
                                <img src={mentor.image} alt={mentor.name} className="w-full aspect-square object-cover" />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(75, 38, 70, 0.45) 0%, transparent 55%)' }} />
                                <div className="absolute bottom-5 left-5">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
                                        style={{ background: 'rgba(255,255,255,0.90)', color: '#D4617A', backdropFilter: 'blur(6px)' }}>
                                        <Star size={12} className="fill-current" /> {mentor.rating} Rating
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { icon: <Briefcase size={17} />, label: 'Experience', value: mentor.experience },
                                    { icon: <Users size={17} />, label: 'Sessions', value: `${mentor.sessions}+` },
                                    { icon: <Award size={17} />, label: 'Rating', value: `${mentor.rating}/5` },
                                ].map((s, i) => (
                                    <div key={i} className="rounded-[1.5rem] p-4 text-center"
                                        style={{ background: 'rgba(255,255,255,0.70)', border: '1.5px solid #fed6f0', backdropFilter: 'blur(12px)' }}>
                                        <div className="flex justify-center mb-1" style={{ color: '#D4617A' }}>{s.icon}</div>
                                        <div className="font-black text-lg leading-none" style={{ color: '#4b2632' }}>{s.value}</div>
                                        <div className="text-xs mt-1 font-medium" style={{ color: '#65434e', opacity: 0.7 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Book Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowModal(true)}
                                className="w-full py-5 font-black text-lg text-white rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden group transition-all"
                                style={{ background: 'linear-gradient(135deg, #D4617A, #fc8fae)', boxShadow: '0 10px 35px rgba(212,97,122,0.30)' }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 14px 50px rgba(212,97,122,0.50)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 10px 35px rgba(212,97,122,0.30)'}
                            >
                                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Heart size={22} />
                                Book Appointment
                            </motion.button>
                        </motion.div>

                        {/* RIGHT */}
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
                            {/* Name & Role */}
                            <div className="rounded-[2.5rem] p-8"
                                style={{ background: 'rgba(255,255,255,0.70)', border: '1.5px solid #fed6f0', backdropFilter: 'blur(14px)' }}>
                                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4"
                                    style={{ background: 'rgba(238, 69, 165, 0.1)', color: '#D4617A', border: '1px solid #fed6f0' }}>
                                    {mentor.specialty}
                                </span>
                                <h1 className="text-4xl font-black leading-tight mb-2" style={{ color: '#4b2637' }}>{mentor.name}</h1>
                                <p className="font-bold text-lg mb-5" style={{ color: '#D4617A' }}>{mentor.role}</p>
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={17}
                                            className={i < Math.floor(mentor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                                    ))}
                                    <span className="text-sm ml-2 font-medium" style={{ color: '#654355', opacity: 0.7 }}>{mentor.rating} / 5.0</span>
                                </div>
                                <p className="text-base leading-relaxed" style={{ color: '#654354' }}>{mentor.bio}</p>
                            </div>

                            {/* Tags */}
                            <div className="rounded-[2.5rem] p-8"
                                style={{ background: 'rgba(255,255,255,0.70)', border: '1.5px solid #fed6f0', backdropFilter: 'blur(14px)' }}>
                                <h2 className="font-black text-xl mb-5 flex items-center gap-2" style={{ color: '#4b2635' }}>
                                    <span className="w-2 h-6 rounded-full inline-block" style={{ background: '#D4617A' }} />
                                    Areas of Expertise
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {mentor.tags.map((tag, i) => (
                                        <span key={i} className="px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-default"
                                            style={{ background: 'rgba(237, 58, 162, 0.08)', color: '#D4617A', border: '1.5px solid #fed6f0' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#D4617A'; e.currentTarget.style.color = 'white'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(237, 58, 159, 0.08)'; e.currentTarget.style.color = '#D4617A'; }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* How it works */}
                            <div className="rounded-[2.5rem] p-8 text-white"
                                style={{ background: 'linear-gradient(135deg, #D4617A, #f687ca)', boxShadow: '0 16px 50px rgba(237, 58, 130, 0.25)' }}>
                                <h2 className="font-black text-xl mb-5 flex items-center gap-3">
                                    <Clock size={20} /> How Appointments Work
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { step: '01', text: 'Click "Book Appointment" and fill in your details and concern.' },
                                        { step: '02', text: `Your request is sent to ${mentor.name.split(' ')[0]}'s email instantly.` },
                                        { step: '03', text: 'They review your request and reply with a suitable meeting time.' },
                                        { step: '04', text: 'Check your inbox for confirmation and join your session.' },
                                    ].map((item) => (
                                        <div key={item.step} className="flex items-start gap-4">
                                            <div className="px-3 py-1.5 rounded-xl text-sm font-black shrink-0"
                                                style={{ background: 'rgba(255,255,255,0.18)' }}>{item.step}</div>
                                            <p className="text-white/80 text-sm leading-relaxed">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <AppointmentModal
                        mentorName={mentor.name}
                        mentorEmail={mentor.email}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default MentorDetail;
