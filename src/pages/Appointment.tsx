import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
    Calendar, User, Heart, CheckCircle, Sparkles,
    Send, Shield, ArrowRight, Brain, X, Clock,
} from 'lucide-react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojnbgzy';
const ADMIN_EMAIL = 'priyakatariya2007@gmail.com';

// ── Data ──────────────────────────────────────────────────────────────
const SESSION_TYPES = [
    { icon: '💬', label: 'General Counseling' },
    { icon: '😰', label: 'Anxiety / Stress' },
    { icon: '📚', label: 'Academic Burnout' },
    { icon: '💔', label: 'Relationship Issues' },
    { icon: '😢', label: 'Grief / Loss Support' },
    { icon: '💪', label: 'Self-Confidence' },
    { icon: '😴', label: 'Sleep & Lifestyle' },
    { icon: '🔄', label: 'Follow-up Session' },
];

const TIME_SLOTS = [
    '9:00 – 10:00 AM',
    '10:00 – 11:00 AM',
    '11:00 – 12:00 PM',
    '1:00 – 2:00 PM',
    '2:00 – 3:00 PM',
    '3:00 – 4:00 PM',
    '4:00 – 5:00 PM',
];

// ── Reusable Field ────────────────────────────────────────────────────
const Field = ({
    label, children,
}: { label: string; children: React.ReactNode }) => (
    <div>
        <label style={{
            display: 'block', fontSize: '0.68rem', fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: '0.45rem', color: '#D4617A',
        }}>
            {label}
        </label>
        {children}
    </div>
);

const inputBase: React.CSSProperties = {
    width: '100%', padding: '0.9rem 1.1rem',
    background: 'rgba(255,245,247,0.7)',
    border: '1.5px solid rgba(249,197,204,0.7)',
    borderRadius: '1rem', color: '#3D1520',
    fontSize: '0.875rem', outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
};

// ── Main Component ────────────────────────────────────────────────────
type Step = 'form' | 'sending' | 'success' | 'error';

export default function Appointment() {
    const user = auth.currentUser;

    const [name, setName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [year, setYear] = useState('');
    const [sessionType, setSessionType] = useState('');
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState<string[]>([]);   // MULTI-SELECT
    const [concern, setConcern] = useState('');
    const [firstVisit, setFirstVisit] = useState('no');
    const [step, setStep] = useState<Step>('form');
    const [errMsg, setErrMsg] = useState('');
    const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

    const toggleSlot = (s: string) =>
        setSlots(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = '#D4617A';
        e.currentTarget.style.background = 'rgba(255,240,243,0.9)';
    };
    const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = 'rgba(249,197,204,0.7)';
        e.currentTarget.style.background = 'rgba(255,245,247,0.7)';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionType) { alert('Please select a session type.'); return; }
        if (slots.length === 0) { alert('Please select at least one preferred time slot.'); return; }
        setStep('sending');

        try {
            await addDoc(collection(db, 'appointments'), {
                studentName: name, studentEmail: email, studentPhone: phone,
                studentYear: year, appointmentType: sessionType,
                preferredDate: date, preferredSlots: slots,
                concern, isFirstVisit: firstVisit,
                uid: user?.uid || null,
                adminEmail: ADMIN_EMAIL,
                status: 'pending',
                createdAt: serverTimestamp(),
            });

            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    _replyto: email,
                    _subject: `🗓️ New Appointment — ${name}`,
                    Name: name, Email: email, Phone: phone, Year_Roll: year,
                    Session_Type: sessionType,
                    Preferred_Date: date,
                    Preferred_Time_Slots: slots.join(' | '),
                    First_Visit: firstVisit === 'no' ? 'Yes — First Visit' : 'No — Return Visit',
                    Reason: concern || 'Not specified',
                    Message: `
New appointment request received via MindEase:

Student: ${name}
Email:   ${email}   ← Reply here with available slots
Phone:   ${phone}
Year/Roll: ${year}
First Visit: ${firstVisit === 'no' ? 'Yes — First Visit' : 'No — Return Visit'}

Session Type:    ${sessionType}
Preferred Date:  ${date}
Preferred Slots: ${slots.join(' | ')}

Reason:
${concern || 'Not specified'}

Please reply to ${email} with confirmed slot(s).
— MindEase, NIT Kurukshetra
          `.trim(),
                }),
            });

            if (!res.ok) throw new Error('Formspree error');
            setStep('success');
        } catch (err: any) {
            setErrMsg(err?.message || 'Something went wrong.');
            setStep('error');
        }
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 pt-28 pb-20"
                style={{ background: 'linear-gradient(135deg,#E88FA3 0%,#D4617A 50%,#C96B84 100%)' }}>
                <div className="max-w-md w-full text-center">
                    {/* Big checkmark card */}
                    <div className="rounded-[2.5rem] p-10 mb-6"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(20px)',
                            border: '1.5px solid rgba(249,197,204,0.6)',
                            boxShadow: '0 20px 60px rgba(212,97,122,0.15)',
                        }}>
                        <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
                            style={{ background: 'linear-gradient(135deg,#D4617A,#C44A6A)' }}>
                            <CheckCircle size={48} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-black mb-2" style={{ color: '#3D1520' }}>Request Sent! 🎉</h1>
                        <p className="text-sm leading-relaxed mb-5" style={{ color: '#7A3545', opacity: 0.8 }}>
                            Your appointment request was sent to <strong>{ADMIN_EMAIL}</strong>.
                            The psychologist will reply to <strong>{email}</strong> with available time slots.
                        </p>
                        {/* Selected slots recap */}
                        <div className="p-4 rounded-2xl mb-5 text-left"
                            style={{ background: 'rgba(255,232,237,0.7)', border: '1.5px solid rgba(249,197,204,0.5)' }}>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#D4617A' }}>Your selected slots</p>
                            {slots.map(s => (
                                <div key={s} className="flex items-center gap-2 mb-1.5">
                                    <Clock size={11} style={{ color: '#D4617A', flexShrink: 0 }} />
                                    <span className="text-xs font-semibold" style={{ color: '#3D1520' }}>{date} · {s}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] leading-relaxed" style={{ color: '#7A3545', opacity: 0.65 }}>
                            📩 Check your inbox (and spam folder) within 1–2 working days.
                        </p>
                    </div>
                    <button
                        onClick={() => { setStep('form'); setSlots([]); setSessionType(''); setConcern(''); setDate(''); }}
                        className="w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                        style={{ background: 'linear-gradient(135deg,#D4617A,#C44A6A)', boxShadow: '0 8px 24px rgba(212,97,122,0.30)' }}>
                        <ArrowRight size={16} /> Book Another Appointment
                    </button>
                </div>
            </div>
        );
    }

    // ── FORM ──────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(160deg,#FFF5F7 0%,#FFE8ED 50%,#FFF0F3 100%)' }}>

            {/* ── Animated Hero ── */}
            <div className="relative overflow-hidden pt-24 pb-32 px-6 text-center"
                style={{ background: 'linear-gradient(135deg,#D4617A 0%,#C44A6A 45%,#7B1D4A 100%)' }}>
                {/* Animated blobs */}
                {[
                    { size: 340, top: '-15%', left: '-8%', anim: 'blob1' },
                    { size: 260, top: '30%', right: '-8%', anim: 'blob2' },
                    { size: 160, top: '60%', left: '35%', anim: 'blob3' },
                ].map((b, i) => (
                    <div key={i} className="absolute rounded-full pointer-events-none"
                        style={{
                            width: b.size, height: b.size,
                            top: b.top, left: (b as any).left, right: (b as any).right,
                            background: 'rgba(255,255,255,0.07)',
                            animation: `${b.anim} 7s ease-in-out infinite`,
                        }} />
                ))}

                <style>{`
          @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,15px) scale(1.06)} }
          @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-15px,20px) scale(0.95)} }
          @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(10px,-15px) scale(1.08)} }
          .slot-btn { transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1); }
          .slot-btn:hover { transform: translateY(-3px) scale(1.04); }
          .slot-btn.selected { transform: translateY(-2px) scale(1.03); }
          .type-btn { transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1); }
          .type-btn:hover { transform: translateY(-3px) scale(1.04); }
          .type-btn.selected { transform: translateY(-2px) scale(1.03); }
          .glass-card { transition: box-shadow 0.3s, transform 0.3s; }
          .glass-card:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(212,97,122,0.14) !important; }
        `}</style>

                <div className="relative max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-xs font-black uppercase tracking-widest"
                        style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)', color: 'white' }}>
                        <Sparkles size={13} /> Book an Appointment
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight text-white">
                        Talk to a Psychologist<br />
                        <span style={{ color: 'rgba(255,220,230,0.95)' }}>at NIT Kurukshetra</span>
                    </h1>
                    <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.72)' }}>
                        Select your preferred time slots — the psychologist will reply with confirmed options.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 -mt-12 space-y-5">

                {/* How it works */}
                <div className="rounded-[2rem] p-5 glass-card"
                    style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(249,197,204,0.55)', boxShadow: '0 8px 32px rgba(212,97,122,0.09)' }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#D4617A' }}>How it works</p>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: '📝', n: '1', t: 'Fill the Form', d: 'Details + multiple slot picks' },
                            { icon: '📩', n: '2', t: 'Psychologist Notified', d: 'Gets your request + email' },
                            { icon: '✅', n: '3', t: 'You Get Slots', d: 'Confirmed time in your inbox' },
                        ].map(s => (
                            <div key={s.n} className="text-center">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mx-auto mb-2 shadow-md"
                                    style={{ background: 'linear-gradient(135deg,#D4617A,#C44A6A)' }}>
                                    {s.icon}
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#D4617A' }}>Step {s.n}</p>
                                <p className="text-xs font-black mt-0.5" style={{ color: '#3D1520' }}>{s.t}</p>
                                <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: '#7A3545', opacity: 0.65 }}>{s.d}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Personal Info */}
                    <div className="rounded-[2rem] overflow-hidden glass-card"
                        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(249,197,204,0.55)', boxShadow: '0 8px 32px rgba(212,97,122,0.09)' }}>
                        <div className="px-6 pt-6 pb-4">
                            <p className="text-sm font-black flex items-center gap-2 mb-4" style={{ color: '#3D1520' }}>
                                <User size={15} style={{ color: '#D4617A' }} /> Personal Information
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field label="Full Name *">
                                    <input style={inputBase} value={name} required placeholder="Your full name"
                                        onChange={e => setName(e.target.value)} onFocus={focus} onBlur={blur} />
                                </Field>
                                <Field label="Email Address *">
                                    <input style={inputBase} type="email" value={email} required placeholder="your@email.com"
                                        onChange={e => setEmail(e.target.value)} onFocus={focus} onBlur={blur} />
                                </Field>
                                <Field label="Phone Number *">
                                    <input style={inputBase} type="tel" value={phone} required placeholder="+91 98765 43210"
                                        onChange={e => setPhone(e.target.value)} onFocus={focus} onBlur={blur} />
                                </Field>
                                <Field label="Year / Roll No.">
                                    <input style={inputBase} value={year} placeholder="e.g. 3rd Year / 21114054"
                                        onChange={e => setYear(e.target.value)} onFocus={focus} onBlur={blur} />
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* Session Type Picker */}
                    <div className="rounded-[2rem] overflow-hidden glass-card"
                        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(249,197,204,0.55)', boxShadow: '0 8px 32px rgba(212,97,122,0.09)' }}>
                        <div className="px-6 pt-6 pb-5">
                            <p className="text-sm font-black flex items-center gap-2 mb-4" style={{ color: '#3D1520' }}>
                                <Brain size={15} style={{ color: '#D4617A' }} /> What type of session do you need?
                                <span className="text-[10px] font-bold ml-auto" style={{ color: '#D4617A', opacity: 0.7 }}>Select one</span>
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {SESSION_TYPES.map(t => {
                                    const sel = sessionType === t.label;
                                    return (
                                        <button key={t.label} type="button"
                                            className={`type-btn${sel ? ' selected' : ''} p-3 rounded-2xl text-center cursor-pointer`}
                                            style={{
                                                background: sel
                                                    ? 'linear-gradient(135deg,#D4617A,#C44A6A)'
                                                    : 'rgba(255,245,247,0.8)',
                                                border: sel ? '1.5px solid #C44A6A' : '1.5px solid rgba(249,197,204,0.6)',
                                                boxShadow: sel ? '0 6px 18px rgba(212,97,122,0.30)' : '0 2px 8px rgba(212,97,122,0.05)',
                                            }}
                                            onClick={() => setSessionType(sel ? '' : t.label)}>
                                            <div className="text-2xl mb-1">{t.icon}</div>
                                            <p className="text-[10px] font-black leading-tight"
                                                style={{ color: sel ? 'white' : '#3D1520' }}>
                                                {t.label}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Date + Time Slots multi-select */}
                    <div className="rounded-[2rem] overflow-hidden glass-card"
                        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(249,197,204,0.55)', boxShadow: '0 8px 32px rgba(212,97,122,0.09)' }}>
                        <div className="px-6 pt-6 pb-5">
                            <p className="text-sm font-black flex items-center gap-2 mb-4" style={{ color: '#3D1520' }}>
                                <Calendar size={15} style={{ color: '#D4617A' }} /> Schedule Preferences
                            </p>

                            <Field label="Preferred Date *">
                                <input style={{ ...inputBase, marginBottom: '1rem' }} type="date" value={date} required
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={e => setDate(e.target.value)} onFocus={focus} onBlur={blur} />
                            </Field>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D4617A' }}>
                                        Preferred Time Slots * — pick as many as you'd like
                                    </label>
                                    {slots.length > 0 && (
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                                            style={{ background: 'rgba(212,97,122,0.12)', color: '#D4617A' }}>
                                            {slots.length} selected
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {TIME_SLOTS.map(s => {
                                        const sel = slots.includes(s);
                                        const hov = hoveredSlot === s && !sel;
                                        return (
                                            <button key={s} type="button"
                                                className={`slot-btn${sel ? ' selected' : ''} py-3 px-3 rounded-2xl flex items-center gap-2 text-left`}
                                                style={{
                                                    background: sel
                                                        ? 'linear-gradient(135deg,#D4617A,#C44A6A)'
                                                        : hov ? 'rgba(255,232,237,0.9)' : 'rgba(255,245,247,0.75)',
                                                    border: sel
                                                        ? '1.5px solid #C44A6A'
                                                        : hov ? '1.5px solid #D4617A' : '1.5px solid rgba(249,197,204,0.6)',
                                                    boxShadow: sel ? '0 6px 18px rgba(212,97,122,0.28)' : hov ? '0 4px 12px rgba(212,97,122,0.10)' : 'none',
                                                }}
                                                onMouseEnter={() => setHoveredSlot(s)}
                                                onMouseLeave={() => setHoveredSlot(null)}
                                                onClick={() => toggleSlot(s)}>
                                                <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        background: sel ? 'rgba(255,255,255,0.25)' : 'rgba(212,97,122,0.1)',
                                                    }}>
                                                    {sel
                                                        ? <CheckCircle size={13} className="text-white" />
                                                        : <Clock size={11} style={{ color: '#D4617A' }} />
                                                    }
                                                </div>
                                                <span className="text-[11px] font-black leading-tight"
                                                    style={{ color: sel ? 'white' : '#3D1520' }}>
                                                    {s}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* Selected slots chips */}
                                {slots.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {slots.map(s => (
                                            <span key={s}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black"
                                                style={{ background: 'rgba(212,97,122,0.10)', color: '#D4617A', border: '1px solid rgba(212,97,122,0.2)' }}>
                                                ✓ {s}
                                                <button type="button" onClick={() => toggleSlot(s)} style={{ lineHeight: 1 }}>
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="rounded-[2rem] overflow-hidden glass-card"
                        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(249,197,204,0.55)', boxShadow: '0 8px 32px rgba(212,97,122,0.09)' }}>
                        <div className="px-6 pt-6 pb-5">
                            <p className="text-sm font-black flex items-center gap-2 mb-4" style={{ color: '#3D1520' }}>
                                <Heart size={15} style={{ color: '#D4617A' }} /> Additional Information
                            </p>
                            <div className="space-y-4">
                                <Field label="What would you like to discuss? (optional — confidential)">
                                    <textarea
                                        style={{ ...inputBase, height: '100px', resize: 'none' } as React.CSSProperties}
                                        value={concern}
                                        onChange={e => setConcern(e.target.value)} onFocus={focus} onBlur={blur}
                                        placeholder="Briefly describe what you'd like to talk about. Only the psychologist will see this." />
                                </Field>
                                <Field label="Have you visited before?">
                                    <div className="flex gap-5 mt-1">
                                        {[
                                            { v: 'no', label: 'No — First visit' },
                                            { v: 'yes', label: 'Yes — Return visit' },
                                        ].map(opt => (
                                            <label key={opt.v}
                                                className="flex items-center gap-2.5 cursor-pointer px-4 py-2.5 rounded-xl transition-all"
                                                style={{
                                                    background: firstVisit === opt.v ? 'rgba(212,97,122,0.10)' : 'rgba(255,245,247,0.5)',
                                                    border: firstVisit === opt.v ? '1.5px solid rgba(212,97,122,0.35)' : '1.5px solid rgba(249,197,204,0.4)',
                                                }}>
                                                <input type="radio" name="visited" value={opt.v}
                                                    checked={firstVisit === opt.v}
                                                    onChange={() => setFirstVisit(opt.v)}
                                                    className="accent-rose-500" />
                                                <span className="text-xs font-black" style={{ color: '#3D1520' }}>{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {step === 'error' && (
                        <div className="px-4 py-3 rounded-2xl flex items-start gap-2"
                            style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}>
                            <span className="text-red-500 text-xl flex-shrink-0">⚠️</span>
                            <div>
                                <p className="text-xs font-black text-red-700">Submission failed — {errMsg}</p>
                                <p className="text-xs text-red-500 mt-1">
                                    Request saved to our database. Please also email: <strong>{ADMIN_EMAIL}</strong>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Privacy + Submit */}
                    <div className="rounded-[2rem] overflow-hidden glass-card"
                        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(249,197,204,0.55)', boxShadow: '0 8px 32px rgba(212,97,122,0.09)' }}>
                        <div className="px-6 pt-5 pb-6">
                            <div className="px-4 py-3 rounded-2xl flex items-start gap-2 mb-5"
                                style={{ background: 'rgba(255,232,237,0.5)', border: '1px dashed rgba(249,197,204,0.8)' }}>
                                <Shield size={13} style={{ color: '#D4617A', marginTop: 2, flexShrink: 0 }} />
                                <p className="text-[11px] leading-relaxed" style={{ color: '#7A3545' }}>
                                    <strong>100% Confidential.</strong> Only the campus psychologist (<strong>{ADMIN_EMAIL}</strong>) receives your request. Not shared with faculty, parents, or admin.
                                </p>
                            </div>

                            <button type="submit" disabled={step === 'sending'}
                                className="w-full py-4 rounded-2xl font-black text-white text-sm disabled:opacity-60 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg,#D4617A,#C44A6A)',
                                    boxShadow: '0 8px 24px rgba(212,97,122,0.32)',
                                }}>
                                {step === 'sending'
                                    ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Sending Request…</>
                                    : <><Send size={16} /> Submit Appointment Request</>
                                }
                            </button>
                            <p className="text-center text-[10px] mt-3" style={{ color: '#D4617A', opacity: 0.55 }}>
                                Sent to <strong>{ADMIN_EMAIL}</strong> · Reply expected within 1–2 working days
                            </p>
                        </div>
                    </div>

                </form>

                {/* Info cards */}
                <div className="grid sm:grid-cols-3 gap-4 pb-4">
                    {[
                        { icon: '📩', title: 'Email Reply', desc: 'Psychologist emails you confirmed slot options', color: '#D4617A' },
                        { icon: '⏱️', title: '50-Minute Sessions', desc: 'One-on-one, private session with the psychologist', color: '#7C3AED' },
                        { icon: '🔒', title: '100% Confidential', desc: 'Private. Not shared with anyone outside the session', color: '#059669' },
                    ].map((c, i) => (
                        <div key={i} className="p-5 rounded-[1.8rem] text-center glass-card"
                            style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(249,197,204,0.5)', boxShadow: '0 4px 20px rgba(212,97,122,0.06)' }}>
                            <div className="text-3xl mb-3">{c.icon}</div>
                            <h4 className="font-black text-sm mb-1" style={{ color: '#3D1520' }}>{c.title}</h4>
                            <p className="text-[11px] leading-relaxed" style={{ color: '#7A3545', opacity: 0.7 }}>{c.desc}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
