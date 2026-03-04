import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Users, FileText, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import { auth } from '../../firebase';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ users: 0, articles: 0, pending: 0 });
  const adminName = auth.currentUser?.displayName || 'Admin';

  useEffect(() => {
    const u = onSnapshot(collection(db, 'users'), snap =>
      setStats(prev => ({ ...prev, users: snap.size })));
    const a = onSnapshot(collection(db, 'articles'), snap =>
      setStats(prev => ({ ...prev, articles: snap.size })));
    const q = query(collection(db, 'articles'), where('status', '==', 'pending'));
    const p = onSnapshot(q, snap =>
      setStats(prev => ({ ...prev, pending: snap.size })));
    return () => { u(); a(); p(); };
  }, []);

  const cards = [
    {
      icon: <Users size={24} className="text-blue-600" />,
      label: 'Total Members',
      value: stats.users,
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      trend: '+12% this month',
      trendColor: 'text-blue-500',
    },
    {
      icon: <FileText size={24} className="text-emerald-600" />,
      label: 'Total Posts',
      value: stats.articles,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      trend: 'All time',
      trendColor: 'text-emerald-500',
    },
    {
      icon: <AlertCircle size={24} className="text-orange-600" />,
      label: 'Pending Review',
      value: stats.pending,
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      trend: 'Need attention',
      trendColor: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, <span className="font-semibold text-blue-700">{adminName}</span>. Here's what's happening at NITK MindEase.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100 self-start sm:self-auto">
          <ShieldCheck size={16} className="text-blue-600" />
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Admin Access</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`p-5 rounded-[2rem] border shadow-sm flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md ${card.bg} ${card.border}`}
          >
            <div className="bg-white p-3 rounded-2xl shadow-sm flex-shrink-0">
              {card.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tight truncate">{card.label}</p>
              <h3 className="text-3xl font-black text-gray-900 leading-tight">{card.value}</h3>
              <p className={`text-[11px] font-semibold flex items-center gap-1 mt-0.5 ${card.trendColor}`}>
                <TrendingUp size={10} /> {card.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-[2rem] p-5 md:p-6 bg-white border border-gray-100 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: '✅ Review Pending Posts', desc: `${stats.pending} posts waiting`, href: '/admin/approve', color: 'bg-orange-50 border-orange-100 hover:bg-orange-100' },
            { label: '📅 Manage Events', desc: 'Create or remove events', href: '/admin/events', color: 'bg-blue-50 border-blue-100 hover:bg-blue-100' },
          ].map((action, i) => (
            <a key={i} href={action.href}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all cursor-pointer ${action.color}`}>
              <div>
                <p className="font-bold text-gray-800 text-sm">{action.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
              </div>
              <span className="text-gray-400 text-lg">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;