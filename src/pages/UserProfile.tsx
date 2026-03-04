import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
    Camera, Pencil, Save, X, Mail, GraduationCap,
    Building2, User, CheckCircle, ArrowLeft,
    ShieldCheck, Hash, Star, BookOpen, Award, Phone
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────
const initials = (s: string) =>
    s.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

// Image Compression: Base64 size ko drastically small kar deta hai
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
            resolve(canvas.toDataURL('image/jpeg', 0.7)); // 0.7 quality is best for Firestore
        };
    });
};

const ROLE_THEME: Record<string, { g: string; light: string; chip: string; text: string }> = {
    student: { g: 'linear-gradient(135deg,#D4617A,#C44A6A,#a83060)', light: '#FFF5F7', chip: '#FFE8ED', text: '#D4617A' },
    alumni: { g: 'linear-gradient(135deg,#059669,#0D9488)', light: '#F0FDF4', chip: '#D1FAE5', text: '#059669' },
    professor: { g: 'linear-gradient(135deg,#D97706,#B45309)', light: '#FFFBEB', chip: '#FEF3C7', text: '#D97706' },
    admin: { g: 'linear-gradient(135deg,#7C3AED,#6366F1)', light: '#F5F3FF', chip: '#EDE9FE', text: '#7C3AED' },
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

    // Editable State
    const [editName, setEditName] = useState('');
    const [editAbout, setEditAbout] = useState('');
    const [editPhone, setEditPhone] = useState('');
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
                setEditAbout(data.aboutMe || '');
                setEditPhone(data.phone || '');
                setPhotoBase64(data.photoBase64 || '');
                setPhotoPreview(data.photoBase64 || '');
            } catch (err) {
                console.error("Error loading profile:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [currentUser, navigate]);

    // ── Photo Handle with Compression ──────────────────────────────────
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
            // Update Firebase Auth Profile
            await updateProfile(currentUser, {
                displayName: editName.trim(),
                photoURL: photoBase64 || null,
            });

            // Update Firestore
            const updatedData = {
                name: editName.trim(),
                aboutMe: editAbout.trim(),
                phone: editPhone.trim(),
                photoBase64: photoBase64 || '',
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
        setEditAbout(firestoreData.aboutMe || '');
        setEditPhone(firestoreData.phone || '');
        setPhotoPreview(photoBase64);
        setEditMode(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF5F7' }}>
            <div className="w-14 h-14 rounded-full border-4 border-t-rose-500 animate-spin"
                style={{ borderColor: '#FFE8ED', borderTopColor: '#D4617A' }} />
        </div>
    );

    const userType: string = firestoreData.userType || firestoreData.role || 'student';
    const theme = ROLE_THEME[userType] || ROLE_THEME.student;
    const isAdmin = userType === 'admin';
    const email = currentUser?.email || '';

    const infoRows = [
        { icon: <Mail size={16} />, label: 'Email', value: email, badge: 'Verified' },
        { icon: <Building2 size={16} />, label: 'Department', value: firestoreData.department || 'Not Assigned' },
        { icon: <ShieldCheck size={16} />, label: 'Role', value: isAdmin ? '👑 Administrator' : userType.toUpperCase() },
    ].filter(Boolean);

    return (
        <div className="min-h-screen pb-16 pt-10"
            style={{ background: 'linear-gradient(160deg,#FFF5F7 0%,#FFE8ED 55%,#FFF0F3 100%)' }}>

            <div className="max-w-xl mx-auto px-4">
                {/* Back Button */}
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-5 text-sm font-bold group transition-all"
                    style={{ color: '#D4617A' }}>
                    <ArrowLeft size={17} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                {/* Profile Card */}
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl bg-white/90 backdrop-blur-md border border-rose-100">

                    {/* Banner Section */}
                    <div className="relative h-32" style={{ background: theme.g }}>
                        <div className="absolute top-4 left-5 flex gap-2">
                            {!editMode ? (
                                <button onClick={() => setEditMode(true)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-md border border-white/30 hover:scale-105 transition-all">
                                    <Pencil size={12} /> Edit Profile
                                </button>
                            ) : (
                                <button onClick={handleCancel}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-black/20 text-white border border-white/20">
                                    <X size={12} /> Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="px-7 pb-8">
                        {/* Avatar */}
                        <div className="flex justify-center -mt-16 mb-4 relative">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden flex items-center justify-center bg-gray-100">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-black text-rose-300">{initials(editName || email)}</span>
                                    )}
                                </div>
                                {editMode && (
                                    <button onClick={() => fileRef.current?.click()}
                                        className="absolute bottom-1 right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-rose-500 text-white hover:scale-110 transition-all border-2 border-white">
                                        <Camera size={16} />
                                    </button>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                            </div>
                        </div>

                        {/* Name Section */}
                        <div className="text-center mb-6">
                            {editMode ? (
                                <input
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="text-center text-2xl font-black w-full max-w-xs mx-auto rounded-xl px-4 py-2 outline-none border-2 border-rose-300 bg-rose-50"
                                />
                            ) : (
                                <h1 className="text-2xl font-black text-gray-800">{firestoreData.name || 'Set Your Name'}</h1>
                            )}
                            <p className="text-sm text-gray-400 mt-1">{email}</p>
                        </div>

                        {/* Status Messages */}
                        {savedOk && (
                            <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-2xl mb-4 text-sm font-bold border border-emerald-100">
                                <CheckCircle size={16} /> Changes Saved!
                            </div>
                        )}
                        {saveError && (
                            <div className="py-3 bg-red-50 text-red-600 rounded-2xl mb-4 text-sm font-bold border border-red-100 text-center">
                                ⚠️ {saveError}
                            </div>
                        )}

                        {/* Editable Content */}
                        <div className="space-y-6">
                            {/* Phone Field */}
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 text-rose-500">
                                    <Phone size={12} /> Mobile Number
                                </h2>
                                {editMode ? (
                                    <input
                                        type="tel"
                                        value={editPhone}
                                        onChange={e => setEditPhone(e.target.value)}
                                        placeholder="Add your contact number"
                                        className="w-full rounded-2xl p-4 text-sm outline-none border-2 border-rose-200 bg-rose-50/50 focus:border-rose-400 transition-colors"
                                    />
                                ) : (
                                    <div className="px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold text-gray-700">
                                        {firestoreData.phone || <span className="font-normal text-gray-400 italic">No phone number added</span>}
                                    </div>
                                )}
                            </section>

                            {/* About Me */}
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 text-rose-500">
                                    <User size={12} /> About Me
                                </h2>
                                {editMode ? (
                                    <textarea
                                        value={editAbout}
                                        onChange={e => setEditAbout(e.target.value)}
                                        rows={3}
                                        placeholder="Describe yourself..."
                                        className="w-full rounded-2xl p-4 text-sm outline-none border-2 border-rose-200 bg-rose-50/50 focus:border-rose-400 transition-colors resize-none"
                                    />
                                ) : (
                                    <div className="px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm leading-relaxed text-gray-600 min-h-[80px]">
                                        {firestoreData.aboutMe || <span className="italic text-gray-400">Your bio is empty...</span>}
                                    </div>
                                )}
                            </section>

                            {/* Locked Info */}
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-widest mb-3 text-gray-400">Account Details</h2>
                                <div className="grid gap-3">
                                    {infoRows.map((row, i) => (
                                        <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-rose-500 shrink-0">
                                                {row.icon}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[9px] uppercase font-black text-gray-400">{row.label}</p>
                                                <p className="text-sm font-bold text-gray-700 truncate">{row.value}</p>
                                            </div>
                                            {row.badge && <span className="text-[10px] font-black px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">✓</span>}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Admin Panel Link / Note */}
                            {isAdmin ? (
                                <a href="/admin"
                                    className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90"
                                    style={{ background: theme.chip, color: theme.text, border: `1px solid ${theme.text}30` }}>
                                    <ShieldCheck size={14} /> 👑 Go to Admin Panel →
                                </a>
                            ) : (
                                <p className="mt-2 text-xs text-gray-400 text-center">
                                    <ShieldCheck size={10} className="inline mr-1" />
                                    Email & department details are locked. Contact admin to update.
                                </p>
                            )}
                        </div>

                        {/* Footer Action */}
                        {editMode && (
                            <button onClick={handleSave} disabled={saving}
                                className="mt-8 w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
                                style={{ background: theme.g }}>
                                {saving ? (
                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</>
                                ) : (
                                    <><Save size={18} /> Update Profile</>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;