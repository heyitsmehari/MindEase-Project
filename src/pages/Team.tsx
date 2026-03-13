import React from 'react';
import { motion } from 'framer-motion';
// Use type-only import for TeamMember
import { TEAM } from '../data/teamData';
import type { TeamMember } from '../data/teamData';

const Team: React.FC = () => {
    // Explicitly typed the TEAM data usage
    const leader = TEAM.find((m: TeamMember) => m.isLeader)!;
    const members = TEAM.filter((m: TeamMember) => !m.isLeader);

    return (
        <div className="min-h-screen" style={{ background: '#FFF5F7' }}>
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-5" style={{ color: '#3D1520' }}>
                        Meet Our{' '}
                        <span style={{ background: 'linear-gradient(135deg, #D4617A, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Team
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.1 }}
                    className="relative rounded-[2.5rem] p-10 md:p-14 mb-10 overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.70)', border: '2px solid rgba(212,97,122,0.30)', backdropFilter: 'blur(20px)', boxShadow: '0 24px 80px rgba(212,97,122,0.18)' }}
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                        <div className="relative flex-shrink-0">
                            <div className="w-44 h-44 rounded-[2rem] overflow-hidden"
                                style={{ border: '4px solid rgba(212,97,122,0.40)', boxShadow: '0 12px 40px rgba(212,97,122,0.25)' }}>
                                <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-black mb-1" style={{ color: '#3D1520' }}>{leader.name}</h2>
                            <p className="text-base font-black mb-4" style={{ color: '#D4617A' }}>{leader.role}</p>
                            <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: '#7A3545' }}>{leader.desc}</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {members.map((m, i) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.2 + i * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="relative rounded-[2rem] p-7 cursor-default overflow-hidden group"
                            style={{ background: 'rgba(255,255,255,0.70)', border: '1.5px solid #F9C5CC', backdropFilter: 'blur(14px)', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}
                        >
                            <div className="w-20 h-20 rounded-2xl overflow-hidden mb-5 mx-auto"
                                style={{ border: `3px solid ${m.color}40`, boxShadow: `0 6px 20px ${m.color}30` }}>
                                <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-lg font-black text-center mb-1" style={{ color: '#3D1520' }}>{m.name}</h3>
                            <p className="text-xs font-black text-center mb-3" style={{ color: m.color }}>{m.role}</p>
                            <p className="text-xs leading-relaxed text-center mb-4" style={{ color: '#7A3545', opacity: 0.80 }}>{m.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Team;