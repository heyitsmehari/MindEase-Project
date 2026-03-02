import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Users, FileText, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ users: 0, articles: 0, pending: 0 });

  useEffect(() => {
    onSnapshot(collection(db, "users"), (snap) => setStats(prev => ({ ...prev, users: snap.size })));
    onSnapshot(collection(db, "articles"), (snap) => setStats(prev => ({ ...prev, articles: snap.size })));
    const q = query(collection(db, "articles"), where("status", "==", "pending"));
    onSnapshot(q, (snap) => setStats(prev => ({ ...prev, pending: snap.size })));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500">Welcome back, Priya. Here's what's happening at NITK MindEase.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="text-blue-600" />} label="Total Members" value={stats.users} bg="bg-blue-50" />
        <StatCard icon={<FileText className="text-emerald-600" />} label="Total Posts" value={stats.articles} bg="bg-emerald-50" />
        <StatCard icon={<AlertCircle className="text-orange-600" />} label="Pending Requests" value={stats.pending} bg="bg-orange-50" />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, bg }: any) => (
  <div className={`p-6 rounded-[2.5rem] border border-white shadow-sm flex items-center gap-5 ${bg}`}>
    <div className="bg-white p-4 rounded-2xl shadow-sm">{icon}</div>
    <div>
      <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">{label}</p>
      <h3 className="text-2xl font-black text-gray-900">{value}</h3>
    </div>
  </div>
);

export default Dashboard;