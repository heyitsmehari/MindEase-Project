import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
    Camera, Pencil, Save, X, Mail, GraduationCap,
    Building2, User, CheckCircle, ArrowLeft,
    ShieldCheck, Star, Globe, Lock, Hash,
    Eye, EyeOff, Award, Calendar, Sparkles
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────
const initials = (s: string) =>
    s.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 400;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
    });
};

const ROLE_THEME: Record<string, { g: string; light: string; chip: string; text: string; badge: string }> = {
    student: { g: 'linear-gradient(135deg,#D4617A,#C44A6A,#a83060)', light: '#FFF5F7', chip: '#FFE8ED', text: '#D4617A', badge: '🎓' },
    alumni: { g: 'linear-gradient(135deg,#059669,#0D9488)', light: '#F0FDF4', chip: '#D1FAE5', text: '#059669', badge: '🌟' },
    professor: { g: 'linear-gradient(135deg,#D97706,#B45309)', light: '#FFFBEB', chip: '#FEF3C7', text: '#D97706', badge: '📚' },
    admin: { g: 'linear-gradient(135deg,#7C3AED,#6366F1)', light: '#F5F3FF', chip: '#EDE9FE', text: '#7C3AED', badge: '👑' },
};

const ROLE_LABEL: Record<string, string> = {
    student: 'Student', alumni: 'Alumni', professor: 'Professor', admin: 'Administrator',
};

// ── Component ─────────────────────────────────────────────────────────
const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const fileRef = useRef<HTMLInputElement>(null);
    const currentUser = auth.currentUser;

    const [firestoreData, setFirestoreData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedOk, setSavedOk] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Editable state
    const [editName, setEditName] = useState('');
    const [editNickname, setEditNickname] = useState('');
    const [editAbout, setEditAbout] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editIsPublic, setEditIsPublic] = useState(false);
    const [photoPreview, setPhotoPreview] = useState('');
    const [photoBase64, setPhotoBase64] = useState('');

    // ── Load Data ──────────────────────────────────────────────────────
    useEffect(() => {
        if (!currentUser) { navigate('/login'); return; }
        (async () => {
            try {
                const snap = await getDoc(doc(db, 'users', currentUser.uid));
                const data = snap.exists() ? snap.data() : {};
                setFirestoreData(data);
                setEditName(data.name || currentUser.displayName || '');
                setEditNickname(data.nickname || '');
                setEditAbout(data.aboutMe || '');
                setEditPhone(data.phone || '');
                setEditIsPublic(data.isPublic ?? false);
                setPhotoBase64(data.photoBase64 || '');
                setPhotoPreview(data.photoBase64 || '');
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [currentUser, navigate]);

    // ── Photo Handle ────────────────────────────────────────────────────
    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const rawBase64 = ev.target?.result as string;
            const compressed = await compressImage(rawBase64);
            setPhotoPreview(compressed);
            setPhotoBase64(compressed);
        };
        reader.readAsDataURL(f);
    };

    // ── Save Changes ───────────────────────────────────────────────────
    const handleSave = async () => {
        if (!currentUser || !editName.trim()) return;
        setSaving(true);
        setSaveError('');
        try {
            await updateProfile(currentUser, {
                displayName: editName.trim(),
                photoURL: photoBase64 || null,
            });
            const updatedData = {
                name: editName.trim(),
                nickname: editNickname.trim(),
                aboutMe: editAbout.trim(),
                phone: editPhone.trim(),
                photoBase64: photoBase64 || '',
                isPublic: editIsPublic,
            };
            await setDoc(doc(db, 'users', currentUser.uid), updatedData, { merge: true });
            setFirestoreData(prev => ({ ...prev, ...updatedData }));
            setEditMode(false);
            setSavedOk(true);
            setTimeout(() => setSavedOk(false), 3000);
        } catch (err: any) {
            setSaveError(err?.message || 'Save failed. Data might be too large.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditName(firestoreData.name || currentUser?.displayName || '');
        setEditNickname(firestoreData.nickname || '');
        setEditAbout(firestoreData.aboutMe || '');
        setEditPhone(firestoreData.phone || '');
        setEditIsPublic(firestoreData.isPublic ?? false);
        setPhotoPreview(photoBase64);
        setEditMode(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg,#FFF5F7 0%,#FFE8ED 55%,#FFF0F3 100%)' }}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full border-4 animate-spin"
                    style={{ borderColor: '#FFE8ED', borderTopColor: '#D4617A' }} />
                <p className="text-sm font-semibold" style={{ color: '#D4617A' }}>Loading your profile...</p>
            </div>
        </div>
    );

    const userType: string = firestoreData.userType || firestoreData.role || 'student';
    const theme = ROLE_THEME[userType] || ROLE_THEME.student;
    const isAdmin = userType === 'admin';
    const email = currentUser?.email || '';

    // Display name priority: nickname → real name → email prefix
    const displayedName = firestoreData.nickname || firestoreData.name || email.split('@')[0];
    const joinDate = firestoreData.createdAt
        ? new Date(firestoreData.createdAt?.seconds * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Member';

    return (
        <div className="min-h-screen pb-20 pt-10"
            style={{ background: 'linear-gradient(160deg,#FFF5F7 0%,#FFE8ED 40%,#FFF0F3 100%)' }}>

            {/* Animated background blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute rounded-full opacity-30"
                    style={{ width: 500, height: 500, top: '-10%', right: '-5%', background: 'radial-gradient(circle, rgba(212,97,122,0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                <div className="absolute rounded-full opacity-20"
                    style={{ width: 400, height: 400, bottom: '5%', left: '-5%', background: 'radial-gradient(circle, rgba(196,74,106,0.4) 0%, transparent 70%)', filter: 'blur(50px)' }} />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-4">
                {/* Back Button */}
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-6 text-sm font-bold group transition-all"
                    style={{ color: '#D4617A' }}>
                    <ArrowLeft size={17} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                {/* ── MAIN PROFILE CARD ── */}
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl bg-white/80 backdrop-blur-xl border border-rose-100/60">

                    {/* ── BANNER ── */}
                    <div className="relative h-40 overflow-hidden" style={{ background: theme.g }}>
                        {/* Decorative circles on banner */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20 bg-white" />
                        <div className="absolute -bottom-8 left-10 w-32 h-32 rounded-full opacity-10 bg-white" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 text-[120px] select-none pointer-events-none">
                            {theme.badge}
                        </div>

                        {/* Edit / Cancel buttons */}
                        <div className="absolute top-4 left-5 flex gap-2 z-10">
                            {!editMode ? (
                                <button onClick={() => setEditMode(true)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-white/35 hover:scale-105 transition-all">
                                    <Pencil size={12} /> Edit Profile
                                </button>
                            ) : (
                                <button onClick={handleCancel}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-black/20 text-white border border-white/20 hover:bg-black/30 transition-all">
                                    <X size={12} /> Cancel
                                </button>
                            )}
                        </div>

                        {/* Privacy badge top-right */}
                        <div className="absolute top-4 right-5 z-10">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/30"
                                style={{ background: 'rgba(255,255,255,0.18)', color: 'white' }}>
                                {firestoreData.isPublic ? <Globe size={11} /> : <Lock size={11} />}
                                {firestoreData.isPublic ? 'Public' : 'Private'}
                            </div>
                        </div>
                    </div>

                    <div className="px-6 sm:px-8 pb-8">
                        {/* ── AVATAR ── */}
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 mb-6">
                            <div className="relative group self-center sm:self-auto">
                                <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden flex items-center justify-center bg-gray-100"
                                    style={{ background: theme.chip }}>
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-black" style={{ color: theme.text }}>
                                            {initials(editName || email)}
                                        </span>
                                    )}
                                </div>
                                {editMode && (
                                    <button onClick={() => fileRef.current?.click()}
                                        className="absolute bottom-1 right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-lg text-white hover:scale-110 transition-all border-2 border-white"
                                        style={{ background: theme.text }}>
                                        <Camera size={15} />
                                    </button>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                            </div>

                            {/* Name + nickname + role chips (right of avatar) */}
                            <div className="flex-1 text-center sm:text-left pb-1">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black"
                                        style={{ background: theme.chip, color: theme.text }}>
                                        {theme.badge} {ROLE_LABEL[userType] || 'Student'}
                                    </span>
                                    {firestoreData.nickname && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                                            <Hash size={10} /> {firestoreData.nickname}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-black text-gray-800 leading-tight">{displayedName}</h1>
                                {firestoreData.nickname && firestoreData.name && (
                                    <p className="text-xs text-gray-400 mt-0.5 italic">Real name hidden · showing nickname</p>
                                )}
                                {firestoreData.department && (
                                    <p className="text-sm font-medium mt-0.5" style={{ color: theme.text }}>{firestoreData.department}</p>
                                )}
                            </div>
                        </div>

                        {/* ── Status messages ── */}
                        {savedOk && (
                            <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-2xl mb-5 text-sm font-bold border border-emerald-100">
                                <CheckCircle size={16} /> Changes Saved!
                            </div>
                        )}
                        {saveError && (
                            <div className="py-3 bg-red-50 text-red-600 rounded-2xl mb-5 text-sm font-bold border border-red-100 text-center">
                                ⚠️ {saveError}
                            </div>
                        )}

                        {/* ── EDIT FORM ── */}
                        {editMode && (
                            <div className="space-y-5 mb-6 p-5 rounded-3xl border border-rose-100 bg-rose-50/30">
                                <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 mb-1" style={{ color: theme.text }}>
                                    <Pencil size={11} /> Edit Your Profile
                                </h2>

                                {/* Display Name */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest block mb-1.5" style={{ color: theme.text }}>
                                        Display Name *
                                    </label>
                                    <input
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        placeholder="Your real name"
                                        className="w-full rounded-2xl px-4 py-3 text-sm outline-none border-2 border-rose-200 bg-white focus:border-rose-400 transition-colors font-semibold text-gray-800"
                                    />
                                </div>

                                {/* Nickname */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest block mb-1.5" style={{ color: theme.text }}>
                                        Nickname (optional · shown instead of real name)
                                    </label>
                                    <div className="relative">
                                        <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            value={editNickname}
                                            onChange={e => setEditNickname(e.target.value)}
                                            placeholder="e.g. StarGazer, MindfulSoul..."
                                            className="w-full rounded-2xl pl-9 pr-4 py-3 text-sm outline-none border-2 border-rose-200 bg-white focus:border-rose-400 transition-colors text-gray-700"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
                                        If set, this hides your real name in public view — your identity stays private.
                                    </p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest block mb-1.5" style={{ color: theme.text }}>
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={editPhone}
                                        onChange={e => setEditPhone(e.target.value)}
                                        placeholder="Add your contact number"
                                        className="w-full rounded-2xl px-4 py-3 text-sm outline-none border-2 border-rose-200 bg-white focus:border-rose-400 transition-colors text-gray-700"
                                    />
                                </div>

                                {/* About Me */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest block mb-1.5" style={{ color: theme.text }}>
                                        About Me
                                    </label>
                                    <textarea
                                        value={editAbout}
                                        onChange={e => setEditAbout(e.target.value)}
                                        rows={3}
                                        placeholder="Describe yourself briefly..."
                                        className="w-full rounded-2xl px-4 py-3 text-sm outline-none border-2 border-rose-200 bg-white focus:border-rose-400 transition-colors resize-none text-gray-700"
                                    />
                                </div>

                                {/* Public / Private toggle */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest block mb-2" style={{ color: theme.text }}>
                                        Profile Visibility
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditIsPublic(false)}
                                            className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${!editIsPublic
                                                ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-md'
                                                : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                                                }`}>
                                            <Lock size={18} />
                                            <span>Private</span>
                                            <p className="text-[10px] font-normal text-center leading-tight opacity-75">
                                                Only you can see<br />your profile details
                                            </p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditIsPublic(true)}
                                            className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${editIsPublic
                                                ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-md'
                                                : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                                                }`}>
                                            <Globe size={18} />
                                            <span>Public</span>
                                            <p className="text-[10px] font-normal text-center leading-tight opacity-75">
                                                Others see your nickname<br />& posts (identity hidden)
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <button onClick={handleSave} disabled={saving}
                                    className="w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
                                    style={{ background: theme.g }}>
                                    {saving ? (
                                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</>
                                    ) : (
                                        <><Save size={18} /> Save Changes</>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* ── VIEW MODE SECTIONS ── */}
                        {!editMode && (
                            <div className="space-y-5">

                                {/* About Me */}
                                <section>
                                    <h2 className="text-[10px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5" style={{ color: theme.text }}>
                                        <Sparkles size={11} /> About Me
                                    </h2>
                                    <div className="px-5 py-4 rounded-2xl border border-gray-100 text-sm leading-relaxed text-gray-600 min-h-[72px]"
                                        style={{ background: theme.light }}>
                                        {firestoreData.aboutMe || <span className="italic text-gray-400">No bio yet — click Edit Profile to add one.</span>}
                                    </div>
                                </section>

                                {/* Contact */}
                                {firestoreData.phone && (
                                    <section>
                                        <h2 className="text-[10px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5" style={{ color: theme.text }}>
                                            <User size={11} /> Contact
                                        </h2>
                                        <div className="px-5 py-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-700"
                                            style={{ background: theme.light }}>
                                            📞 {firestoreData.phone}
                                        </div>
                                    </section>
                                )}

                                {/* Privacy Status Card */}
                                <section>
                                    <h2 className="text-[10px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5" style={{ color: theme.text }}>
                                        {firestoreData.isPublic ? <Eye size={11} /> : <EyeOff size={11} />} Privacy Status
                                    </h2>
                                    <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${firestoreData.isPublic
                                        ? 'border-emerald-100 bg-emerald-50'
                                        : 'border-rose-100 bg-rose-50'
                                        }`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${firestoreData.isPublic ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
                                            {firestoreData.isPublic ? <Globe size={18} /> : <Lock size={18} />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-black ${firestoreData.isPublic ? 'text-emerald-700' : 'text-rose-600'}`}>
                                                {firestoreData.isPublic ? 'Public Profile' : 'Private Profile'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {firestoreData.isPublic
                                                    ? 'Others can see your nickname and posts. Your real identity is hidden.'
                                                    : 'Only you can see your full profile details.'}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Account Details */}
                                <section>
                                    <h2 className="text-[10px] font-black uppercase tracking-widest mb-3 text-gray-400">Account Details</h2>
                                    <div className="grid gap-3">
                                        {[
                                            { icon: <Mail size={15} />, label: 'Email', value: email, badge: '✓ Verified' },
                                            { icon: <Building2 size={15} />, label: 'Department', value: firestoreData.department || 'Not Assigned' },
                                            { icon: <ShieldCheck size={15} />, label: 'Role', value: isAdmin ? '👑 Administrator' : (ROLE_LABEL[userType] || userType) },
                                            ...(joinDate !== 'Member' ? [{ icon: <Calendar size={15} />, label: 'Joined', value: joinDate }] : []),
                                        ].map((row, i) => (
                                            <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ background: theme.chip, color: theme.text }}>
                                                    {row.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[9px] uppercase font-black text-gray-400">{row.label}</p>
                                                    <p className="text-sm font-bold text-gray-700 truncate">{row.value}</p>
                                                </div>
                                                {row.badge && (
                                                    <span className="text-[10px] font-black px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">{row.badge}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Nickname info card (if nickname set) */}
                                {firestoreData.nickname && (
                                    <section>
                                        <h2 className="text-[10px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5" style={{ color: theme.text }}>
                                            <Hash size={11} /> Your Nickname
                                        </h2>
                                        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow"
                                                style={{ background: theme.g }}>
                                                <Hash size={18} />
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-gray-800">{firestoreData.nickname}</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">This alias hides your real identity publicly</p>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* Admin Panel shortcut */}
                                {isAdmin && (
                                    <a href="/admin"
                                        className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90"
                                        style={{ background: theme.chip, color: theme.text, border: `1px solid ${theme.text}30` }}>
                                        <ShieldCheck size={14} /> 👑 Go to Admin Panel →
                                    </a>
                                )}

                                {/* Footnote */}
                                {!isAdmin && (
                                    <p className="mt-2 text-xs text-gray-400 text-center">
                                        <ShieldCheck size={10} className="inline mr-1" />
                                        Email & department are locked. Contact admin to update.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;