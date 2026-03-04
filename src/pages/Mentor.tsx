import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Search, ChevronRight, Sparkles } from 'lucide-react';
import { MENTORS } from '../data/mentorData';

export default function Mentor() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = MENTORS.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.specialty.toLowerCase().includes(query.toLowerCase()) ||
      m.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ background: '#FFF5F7' }}>

      {/* Ambient background orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[550px] h-[550px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(205,193,255,0.45) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.28) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        

        <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black mt-2 mb-4 tracking-tight" style={{ color: '#3D1520' }}>
          Find Your{' '}
          <span style={{
            background: 'linear-gradient(135deg, #D4617A 0%, #e692a4 50%, #D4617A 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Perfect Mentor
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          className="max-w-xl mx-auto text-base mb-10" style={{ color: '#7A3545' }}>
          Connect with certified professionals who specialize in student mental health and wellbeing.
        </motion.p>

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
          className="max-w-xl mx-auto flex items-center gap-3 p-3 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.70)', boxShadow: '0 6px 25px rgba(0,0,0,0.05)', backdropFilter: 'blur(12px)' }}>
          <Search size={18} className="ml-2 shrink-0" style={{ color: '#e692a4' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, or specialty..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: '#3D1520', caretColor: '#D4617A' }}
          />
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #D4617A, #D4617A)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgb(255, 183, 213)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            Search
          </button>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((mentor, i) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/mentor/${mentor.id}`)}
            className="relative rounded-[2rem] p-6 cursor-pointer group overflow-hidden transition-all"
            style={{ background: 'rgba(255,255,255,0.65)', boxShadow: '0 6px 25px rgba(0,0,0,0.05)', backdropFilter: 'blur(14px)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.90)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.05)'
      
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(124,58,237,0.14), 0 4px 16px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.65)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.05)';
            }}
          >
            {/* Glow on hover */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Image */}
            <div className="relative mb-5 rounded-[1.5rem] overflow-hidden aspect-square">
              <img src={mentor.image} alt={mentor.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(45,38,75,0.45) 0%, transparent 55%)' }} />
              {/* Experience badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black"
                style={{ background: 'rgba(255, 214, 229, 0.9)', boxShadow: '0 6px 25px rgba(0,0,0,0.05)', backdropFilter: 'blur(6px)', color: '#D4617A' }}>
                {mentor.experience} Exp
              </div>
              
            </div>

            {/* Info */}
            <h3 className="font-black text-lg leading-tight mb-1 transition-colors group-hover:text-[#D4617A]"
              style={{ color: '#70273b' }}>{mentor.name}</h3>
            <p className="text-sm font-bold mb-3" style={{ color: '#D4617A' }}>{mentor.role}</p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {mentor.tags.slice(0, 2).map((tag, ti) => (
                <span key={ti} className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ background: 'rgba(229, 98, 161, 0.08)', color: '#D4617A', boxShadow: '0 6px 25px rgba(0,0,0,0.05)'}}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4"
              style={{ borderTop: '1.5px solid #EDE9FF' }}>
              <span className="text-xs" style={{ color: '#7A3545', opacity: 0.65 }}>{mentor.sessions}+ sessions</span>
              <div className="flex items-center gap-1.5 text-sm font-black transition-all group-hover:gap-2.5"
                style={{ color: '#D4617A' }}>
                View Profile <ChevronRight size={15} />
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20" style={{ color: '#7A3545' }}>
            <p className="text-xl font-bold">No mentors found for "{query}"</p>
            <p className="text-sm mt-2 opacity-60">Try searching by specialty, name, or role.</p>
          </div>
        )}
      </div>
    </div>
  );
}