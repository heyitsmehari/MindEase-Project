import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  Menu, X, HeartPulse, LogOut,
  LayoutDashboard, Home as HomeIcon,
  Info, HelpCircle, Phone, AlertCircle, Users, MessageSquare,
  Activity, BookOpen, UserCircle, Calendar, Bot, User
} from 'lucide-react';

type UserType = 'student' | 'alumni' | 'professor' | 'admin';

interface UserData {
  email: string;
  role: 'student' | 'admin';
  userType: UserType;
  displayName?: string;
}

interface NavLink {
  to: string;
  label: string;
  icon: React.ReactElement;
  highlight?: boolean;
}

const getRoleLabel = (userType: UserType): string => {
  switch (userType) {
    case 'admin': return 'Administrator';
    case 'professor': return 'Professor';
    case 'alumni': return 'Alumni';
    default: return 'Student';
  }
};

const getDashboardRoute = (userType: UserType): string => {
  switch (userType) {
    case 'admin': return '/admin';
    case 'professor': return '/professor-dashboard';
    case 'alumni': return '/alumni-dashboard';
    default: return '/dashboard';
  }
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navphoto, setNavPhoto] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          let userRole: 'student' | 'admin' = 'student';
          let userType: UserType = 'student';

          if (userDoc.exists()) {
            const data = userDoc.data();
            userRole = data.role === 'admin' ? 'admin' : 'student';
            if (data.userType === 'professor') userType = 'professor';
            else if (data.userType === 'alumni') userType = 'alumni';
            else if (data.role === 'admin') userType = 'admin';
            else userType = 'student';
            setNavPhoto(data.photoBase64 || '');
          }

          setUser({
            email: currentUser.email || '',
            role: userRole,
            userType,
            displayName: currentUser.displayName || undefined,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({ email: currentUser.email || '', role: 'student', userType: 'student' });
        }
      } else {
        setUser(null);
        setNavPhoto('');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isProfileDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsMobileMenuOpen(false);
      setIsProfileDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const handleDashboardClick = () => {
    navigate(getDashboardRoute(user!.userType));
    setIsProfileDropdownOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const guestLinks: NavLink[] = [
    { to: '/', label: 'Home', icon: <HomeIcon size={18} /> },
    { to: '/about', label: 'About', icon: <Info size={18} /> },
    { to: '/faq', label: 'FAQ', icon: <HelpCircle size={18} /> },
    { to: '/contact', label: 'Contact', icon: <Phone size={18} /> },
    { to: '/emergency', label: 'Emergency', icon: <AlertCircle size={18} />, highlight: true },
  ];

  const loggedInLinks: NavLink[] = [
    { to: '/', label: 'Home', icon: <HomeIcon size={18} /> },
    { to: '/mentor', label: 'Mentor', icon: <Users size={18} /> },
    { to: '/resources', label: 'Resources', icon: <BookOpen size={18} /> },
    { to: '/mood', label: 'Mood Tracker', icon: <Activity size={18} /> },
    { to: '/community', label: 'Community', icon: <MessageSquare size={18} /> },
    { to: '/appointment', label: 'Appointment', icon: <Calendar size={18} /> },
    { to: '/chatbot', label: 'Chatbot', icon: <Bot size={18} /> },
  ];

  const navigationLinks = user ? loggedInLinks : guestLinks;

  const avatarGradient = () => {
    switch (user?.userType) {
      case 'admin': return 'from-purple-600 to-purple-800';
      case 'professor': return 'from-amber-500 to-orange-600';
      case 'alumni': return 'from-emerald-500 to-teal-600';
      default: return 'from-blue-600 to-blue-800';
    }
  };



  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-rose-100'
        : 'bg-white border-b border-gray-100'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-gradient-to-br from-rose-500 to-pink-700 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md">
              <HeartPulse className="text-white" size={24} />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-700 bg-clip-text text-transparent">
                MindEase
              </span>
              <span className="text-xs text-gray-500 block -mt-1">Mental Wellness</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${link.highlight
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 animate-pulse'
                  : isActive(link.to)
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons / Profile Dropdown */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="w-32 h-10 bg-gray-100/70 animate-pulse rounded-lg"></div>
            ) : !user ? (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-rose-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Signup
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center pl-3 border-l border-gray-200 hover:opacity-80 transition-opacity"
                  title={user.displayName || user.email}
                >
                  <div className={`h-10 w-10 rounded-full overflow-hidden flex items-center justify-center text-white shadow-md bg-gradient-to-br ${avatarGradient()} ring-2 ring-rose-100 hover:ring-rose-300 transition-all`}>
                    {navphoto ? (
                      <img src={navphoto} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle size={24} />
                    )}
                  </div>
                </button>

                {/* Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-rose-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-rose-50 mb-1">
                      <p className="text-xs text-gray-500">{getRoleLabel(user.userType)}</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user.displayName || user.email}</p>
                    </div>
                    <button
                      onClick={handleDashboardClick}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <LayoutDashboard size={18} />
                      <span className="font-medium">My Dashboard</span>
                    </button>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <User size={18} />
                      <span className="font-medium">My Profile</span>
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-4 bg-white border-t border-rose-100 shadow-inner">
          <div className="space-y-1 mb-4">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${link.highlight
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : isActive(link.to)
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-rose-50 hover:text-rose-600'
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {loading ? (
             <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <div className="w-full h-12 bg-gray-100/70 animate-pulse rounded-lg"></div>
             </div>
          ) : !user ? (
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
              <Link to="/login" className="w-full px-4 py-3 text-center font-semibold text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm border border-gray-200">
                Login
              </Link>
              <Link to="/signup" className="w-full px-4 py-3 text-center font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-md">
                Signup
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 rounded-lg">
                <div className={`h-12 w-12 rounded-full overflow-hidden flex items-center justify-center text-white shadow-md bg-gradient-to-br ${avatarGradient()}`}>
                  {navphoto ? (
                    <img src={navphoto} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle size={28} />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">{getRoleLabel(user.userType)}</p>
                  <p className="text-sm font-bold text-gray-800 truncate max-w-[160px]">{user.displayName || user.email.split('@')[0]}</p>
                </div>
              </div>
              <button
                onClick={handleDashboardClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 font-semibold transition-colors"
              >
                <LayoutDashboard size={20} />
                My Dashboard
              </button>
              <Link
                to="/profile"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 font-semibold transition-colors"
              >
                <User size={20} />
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-semibold transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;