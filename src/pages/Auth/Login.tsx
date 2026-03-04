import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Mail, Lock, Chrome, AlertCircle, X } from 'lucide-react';
import WelcomeScreen from '../../components/WelcomeScreen';

// Fetch user role from Firestore and redirect appropriately
const getRedirectPath = async (uid: string): Promise<string> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      if (data.userType === 'professor') return '/professor-dashboard';
      if (data.userType === 'alumni') return '/alumni-dashboard';
    }
  } catch (_) { }
  return '/dashboard'; // default = student
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [welcomeInfo, setWelcomeInfo] = useState<{ name: string; path: string } | null>(null);

  const clearError = () => setError('');

  const getFriendlyError = (code: string): string => {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait a few minutes and try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'Sign in failed. Please check your credentials and try again.';
    }
  };

  // 📧 Email/Password Login — fetch role, redirect accordingly
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const path = await getRedirectPath(cred.user.uid);
      const name = cred.user.displayName || email.split('@')[0] || 'Friend';
      setWelcomeInfo({ name, path });
      setTimeout(() => navigate(path), 3200);
    } catch (err: any) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // 🌐 Google Login — create Firestore doc if first time (default student), then redirect
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError('');
    try {
      const cred = await signInWithPopup(auth, provider);
      const uid = cred.user.uid;

      // Create user doc if first Google sign-in (default: student)
      const snap = await getDoc(doc(db, 'users', uid));
      if (!snap.exists()) {
        await setDoc(doc(db, 'users', uid), {
          name: cred.user.displayName || '',
          email: cred.user.email || '',
          userType: 'student',
          role: 'user',
          createdAt: new Date(),
        });
      }

      const path = await getRedirectPath(uid);
      const name = cred.user.displayName || cred.user.email?.split('@')[0] || 'Friend';
      setWelcomeInfo({ name, path });
      setTimeout(() => navigate(path), 3200);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setLoading(false);
        return;
      }
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Show welcome overlay after successful login
  if (welcomeInfo) {
    return <WelcomeScreen name={welcomeInfo.name} isSignup={false} />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE8ED 50%, #FFF0F3 100%)' }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-[2.5rem] p-10 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.92)',
            border: '2px solid #F9C5CC',
            boxShadow: '0 40px 100px rgba(212,97,122,0.15)',
          }}
        >
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #D4617A, #C44A6A)', boxShadow: '0 8px 24px rgba(212,97,122,0.35)' }}
            >
              🧠
            </div>
            <h1 className="text-3xl font-black" style={{ color: '#3D1520' }}>Welcome Back</h1>
            <p className="text-sm mt-1.5 font-medium" style={{ color: '#7A3545' }}>
              Sign in to your MindEase account
            </p>
          </div>

          {/* Error Toast */}
          {error && (
            <div
              className="flex items-start gap-3 p-4 rounded-2xl mb-6"
              style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}
            >
              <AlertCircle size={17} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-700 flex-1">{error}</p>
              <button onClick={clearError}><X size={15} className="text-red-400 hover:text-red-600" /></button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#D4617A' }}>Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#D4617A' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
                  style={{ background: '#FFF5F7', border: '1.5px solid #F9C5CC', color: '#3D1520' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#D4617A'}
                  onBlur={e => e.currentTarget.style.borderColor = '#F9C5CC'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#D4617A' }}>Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#D4617A' }} />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
                  style={{ background: '#FFF5F7', border: '1.5px solid #F9C5CC', color: '#3D1520' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#D4617A'}
                  onBlur={e => e.currentTarget.style.borderColor = '#F9C5CC'}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-white text-base transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #D4617A, #C44A6A)', boxShadow: '0 8px 24px rgba(212,97,122,0.35)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: '#F9C5CC' }} />
            <span className="text-xs font-bold" style={{ color: '#D4617A', opacity: 0.6 }}>OR</span>
            <div className="flex-1 h-px" style={{ background: '#F9C5CC' }} />
          </div>

          <button
            onClick={handleGoogleLogin} disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-60"
            style={{ background: 'white', border: '1.5px solid #F9C5CC', color: '#3D1520' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FFF5F7'; e.currentTarget.style.borderColor = '#D4617A'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#F9C5CC'; }}
          >
            <Chrome size={18} className="text-blue-500" />
            Continue with Google
          </button>

          <p className="text-center text-sm mt-7" style={{ color: '#7A3545' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-black" style={{ color: '#D4617A' }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;