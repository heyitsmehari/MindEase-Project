import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, CalendarPlus, LogOut,
  Home, ShieldCheck, Menu, X, Play, Users, BookOpen, Calendar
} from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Overview', section: null },
    { path: '/admin/approve', icon: <CheckSquare size={18} />, label: 'Approve Posts', section: null },
    { path: '/admin/events', icon: <CalendarPlus size={18} />, label: 'Add Content', section: 'MANAGE' },
    { path: '/admin/view-events', icon: <Calendar size={18} />, label: 'Events', section: null },
    { path: '/admin/view-videos', icon: <Play size={18} />, label: 'Videos', section: null },
    { path: '/admin/view-sessions', icon: <Users size={18} />, label: 'Sessions', section: null },
    { path: '/admin/view-books', icon: <BookOpen size={18} />, label: 'Books', section: null },
  ];

  const isActive = (path: string) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-blue-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-300" size={24} />
          <span className="font-bold text-lg tracking-wider">ADMIN</span>
        </div>
        <button className="md:hidden p-1 rounded-lg hover:bg-blue-800 transition" onClick={() => setSidebarOpen(false)}>
          <X size={19} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto">
        {menuItems.map((item) => (
          <React.Fragment key={item.path}>
            {item.section && (
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mt-4 mb-1 px-3">{item.section}</p>
            )}
            <Link
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium ${isActive(item.path)
                  ? 'bg-blue-700 shadow-inner text-white'
                  : 'opacity-75 hover:opacity-100 hover:bg-blue-800'
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800 space-y-1">
        <Link to="/" onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 p-3 text-sm opacity-70 hover:opacity-100 hover:bg-blue-800 rounded-xl transition">
          <Home size={17} /> Back to Website
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 text-sm text-red-300 hover:bg-red-900/30 rounded-xl transition">
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#1e3a8a] text-white hidden md:flex flex-col sticky top-0 h-screen shadow-2xl flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1e3a8a] text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-[#1e3a8a] text-white shadow-lg">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-blue-800 transition">
            <Menu size={21} />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck size={19} className="text-blue-300" />
            <span className="font-bold text-sm tracking-wide">Admin Panel</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;