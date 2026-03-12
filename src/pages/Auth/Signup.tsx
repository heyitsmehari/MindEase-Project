import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, BookOpen, GraduationCap, Building2, Camera } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import WelcomeScreen from '../../components/WelcomeScreen';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('student');
  const [photoBase64, setPhotoBase64] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [redirectPath, setRedirectPath] = useState('/dashboard');
  const fileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    department: '',
    yearOrBatch: '',
    designation: '',
    password: ''
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be under 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target?.result as string;
      setPhotoPreview(b64);
      setPhotoBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      await updateProfile(userCredential.user, {
        displayName: formData.name,
        photoURL: photoBase64 || null,
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...formData,
        userType,
        photoBase64: photoBase64 || '',
        aboutMe: '',
        role: 'user',
        createdAt: new Date(),
      });

      const path =
        userType === 'professor'
          ? '/professor-dashboard'
          : userType === 'alumni'
          ? '/alumni-dashboard'
          : '/dashboard';

      setWelcomeName(formData.name);
      setRedirectPath(path);
      setShowWelcome(true);

      setTimeout(() => navigate(path), 3200);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        alert('⚠️ This email is already registered. Please login instead.');
      } else if (error.code === 'auth/weak-password') {
        alert('⚠️ Password too weak. Please use at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        alert('⚠️ Invalid email address. Please check and try again.');
      } else {
        alert('Something went wrong: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (showWelcome) {
    return <WelcomeScreen name={welcomeName} isSignup={true} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7] px-4 py-12">

      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-[#F9C5CC]">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#3D1520]">Join Community</h2>
          <p className="text-[#7A3545] text-sm mt-2">Connect with NITK Mentors & Peers</p>
        </div>

        {/* USER TYPE SELECTOR */}

        <div className="flex bg-[#FFE8ED] p-1 rounded-2xl mb-6 gap-1">
          {['student', 'professor', 'alumni'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setUserType(type)}
              className={`flex-1 py-2 text-sm font-bold rounded-xl capitalize transition-all ${
                userType === type
                  ? 'bg-white text-[#D4617A] shadow-sm'
                  : 'text-[#7A3545]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* PHOTO PICKER */}

        <div className="flex flex-col items-center mb-6">

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-full border-4 border-dashed border-[#F9C5CC] flex items-center justify-center overflow-hidden group transition-all hover:border-[#D4617A]"
            style={{ background: photoPreview ? 'transparent' : '#FFE8ED' }}
          >

            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Camera size={24} className="text-[#F4A0B0] group-hover:text-[#D4617A] transition-colors" />
                <span className="text-[10px] font-bold text-[#F4A0B0] group-hover:text-[#D4617A] transition-colors">
                  Add Photo
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={22} className="text-white" />
            </div>

          </button>

          <p className="text-xs text-gray-400 mt-2">Optional — max 2 MB</p>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input icon={<UserPlus size={18} />} placeholder="Full Name"
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input icon={<Mail size={18} />} type="email" placeholder="Email ID"
              onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Department + Year */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A3545]" size={18} />

              <select
                required
                className="w-full pl-12 pr-4 py-4 bg-[#FFE8ED] rounded-2xl outline-none appearance-none text-sm"
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">Department</option>
                <option value="CSE">Computer Science</option>
                <option value="IT">Information Technology</option>
                <option value="ECE">Electronics</option>
                <option value="MECH">Mechanical</option>
              </select>
            </div>

            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A3545]" size={18} />

              {userType === 'professor' ? (
                <input
                  placeholder="Designation"
                  className="w-full pl-12 pr-4 py-4 bg-[#FFE8ED] rounded-2xl outline-none text-sm"
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  required
                />
              ) : (
                <input
                  placeholder={userType === 'student' ? 'Year (1st, 2nd...)' : 'Batch (e.g. 2018)'}
                  className="w-full pl-12 pr-4 py-4 bg-[#FFE8ED] rounded-2xl outline-none text-sm"
                  onChange={(e) => setFormData({ ...formData, yearOrBatch: e.target.value })}
                  required
                />
              )}
            </div>

          </div>

          {userType === 'student' && (
            <Input
              icon={<BookOpen size={18} />}
              placeholder="Roll Number"
              onChange={(e: any) => setFormData({ ...formData, rollNo: e.target.value })}
            />
          )}

          <Input
            icon={<Lock size={18} />}
            type="password"
            placeholder="Password"
            onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
          />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4617A] to-[#C44A6A] text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'}
          </button>

        </form>

        <p className="text-center text-sm text-[#7A3545] mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[#D4617A] font-bold hover:underline">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

const Input = ({ icon, ...props }: any) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A3545] group-focus-within:text-[#D4617A] transition-colors">
      {icon}
    </div>

    <input
      {...props}
      required
      className="w-full pl-12 pr-4 py-4 bg-[#FFE8ED] rounded-2xl outline-none focus:ring-2 ring-[#F9C5CC] text-sm transition-all"
    />
  </div>
);

export default Signup;