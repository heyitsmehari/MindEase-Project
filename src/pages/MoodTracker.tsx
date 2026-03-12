import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Heart, Lightbulb, LayoutDashboard,
  ArrowRight, ArrowLeft, Save, CheckCircle2,
  Sparkles, AlertTriangle, TrendingUp, Shield, Clock, X
} from 'lucide-react';

import MoodForm, { type MoodFormData } from '../components/mood/MoodForm';
import BehavioralForm, { type BehavioralFormData } from '../components/mood/BehavioralForm';
import MoodDashboard from '../components/mood/MoodDashboard';

import { calculateMoodScore } from '../engines/PredictionEngine';
import { generateInsight, type InsightResult } from '../engines/InsightEngine';
import { saveMoodEntry } from '../services/storageService';

type Tab = 'log' | 'dashboard';

const STEPS = [
  { id: 0, label: 'Energy & Academic', icon: Brain },
  { id: 1, label: 'Emotions & Social', icon: Heart },
  { id: 2, label: 'Results', icon: Lightbulb },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

// Updated to match Appointment page's rose palette
const moodGradients: Record<string, string> = {
  'Distressed': 'from-[#D4617A] to-[#7B1D4A]',
  'Low Mood': 'from-[#F9C5CC] to-[#D4617A]',
  'Neutral': 'from-[#FFE8ED] to-[#F9C5CC]',
  'Positive': 'from-[#D4617A] to-[#C44A6A]',
  'Very Positive': 'from-[#C44A6A] to-[#7B1D4A]',
};

const moodBg: Record<string, string> = {
  'Distressed': 'bg-red-50 border-red-200',
  'Low Mood': 'bg-amber-50 border-amber-200',
  'Neutral': 'bg-rose-50 border-rose-200',
  'Positive': 'bg-rose-50 border-rose-200',
  'Very Positive': 'bg-rose-100 border-rose-300',
};

const MoodTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('log');
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [saved, setSaved] = useState(false);

  const [moodData, setMoodData] = useState<MoodFormData>({
    energy: 5, sleep: 5, difficultyStart: 5, tiredness: 5, focus: 5, workloadStress: 5, productivity: 5,
  });

  const [behavioralData, setBehavioralData] = useState<BehavioralFormData>({
    calm: 5, irritation: 5, hopeful: 5, connected: 5, lonely: 5,
  });

  const [insight, setInsight] = useState<InsightResult | null>(null);

  const goNext = () => {
    if (step === 1) {
      const allInputs = { ...moodData, ...behavioralData };
      const { moodScore, mood, emoji } = calculateMoodScore(allInputs);
      const ins = generateInsight(allInputs, moodScore, mood, emoji);
      setInsight(ins);
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 2));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSave = async () => {
    if (!insight) return;
    const allInputs = { ...moodData, ...behavioralData };
    await saveMoodEntry({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...allInputs,
      moodScore: insight.moodScore,
      mood: insight.mood,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setStep(0);
      setMoodData({ energy: 5, sleep: 5, difficultyStart: 5, tiredness: 5, focus: 5, workloadStress: 5, productivity: 5 });
      setBehavioralData({ calm: 5, irritation: 5, hopeful: 5, connected: 5, lonely: 5 });
      setInsight(null);
      setActiveTab('dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#FFF5F7 0%,#FFE8ED 50%,#FFF0F3 100%)' }}>

      {/* CSS for Blobs & Hover Effects from Appointment.tsx */}
      <style>{`
          @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,15px) scale(1.06)} }
          @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-15px,20px) scale(0.95)} }
          @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(10px,-15px) scale(1.08)} }
          .glass-card { transition: box-shadow 0.3s, transform 0.3s; }
          .glass-card:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(212,97,122,0.14) !important; }
      `}</style>

      {/* Header Updated to match Appointment.tsx Hero */}
      <section className="relative overflow-hidden pt-24 pb-32 px-6 text-center"
        style={{ background: 'linear-gradient(135deg,#D4617A 0%,#C44A6A 45%,#7B1D4A 100%)' }}>
        {[
          { size: 340, top: '-15%', left: '-8%', anim: 'blob1' },
          { size: 260, top: '30%', right: '-8%', anim: 'blob2' },
          { size: 160, top: '60%', left: '35%', anim: 'blob3' },
        ].map((b, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{
              width: b.size, height: b.size,
              top: b.top, left: (b as any).left, right: (b as any).right,
              background: 'rgba(255,255,255,0.07)',
              animation: `${b.anim} 7s ease-in-out infinite`,
            }} />
        ))}
        <br />

        <div className="relative max-w-4xl mx-auto z-10">
          
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight text-white">
            Mood Tracker<br />
            <span style={{ color: 'rgba(255,220,230,0.95)' }}>How are you feeling?</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Answer a few quick questions about your day and get personalized insights about your well-being.
          </p>
        </div>
      </section>

      {/* Tab Switcher */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="rounded-[2rem] p-1.5 flex gap-1 shadow-lg"
          style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(249,197,204,0.55)' }}>
          <TabButton
            active={activeTab === 'log'}
            onClick={() => setActiveTab('log')}
            icon={<Brain size={18} />}
            label="Log Mood"
          />
          <TabButton
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {activeTab === 'dashboard' ? (
          <MoodDashboard />
        ) : (
          <div>
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {STEPS.map(({ id, label, icon: Icon }) => (
                <React.Fragment key={id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${step === id
                        ? 'text-white shadow-lg scale-110'
                        : step > id
                          ? 'bg-rose-500 text-white'
                          : 'bg-white text-[#D4617A] border border-[#F9C5CC]'
                        }`}
                      style={step === id ? { background: 'linear-gradient(135deg,#D4617A,#C44A6A)' } : {}}
                    >
                      {step > id ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step >= id ? 'text-[#D4617A]' : 'text-[#7A3545] opacity-40'}`}
                    >
                      {label}
                    </span>
                  </div>
                  {id < 2 && (
                    <div className={`w-8 h-0.5 rounded-full ${step > id ? 'bg-[#D4617A]' : 'bg-[#F9C5CC]'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step Content */}
            <div className="glass-card rounded-[2.5rem] p-6 md:p-10 min-h-[400px] overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(249,197,204,0.6)', boxShadow: '0 20px 60px rgba(212,97,122,0.15)' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  {step === 0 && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#D4617A' }}>Daily Check-in</p>
                      <h2 className="text-3xl font-black text-[#3D1520] mb-2">How's your day going?</h2>
                      <p className="text-sm text-[#7A3545] opacity-70 mb-8">Rate each question on a scale of 1–10. Be honest — there are no wrong answers.</p>
                      <MoodForm data={moodData} onChange={setMoodData} />
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#D4617A' }}>Emotional Pulse</p>
                      <h2 className="text-3xl font-black text-[#3D1520] mb-2">How do you feel emotionally?</h2>
                      <p className="text-sm text-[#7A3545] opacity-70 mb-8">A few more questions about your emotions and social connections.</p>
                      <BehavioralForm data={behavioralData} onChange={setBehavioralData} />
                    </div>
                  )}

                  {step === 2 && insight && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#D4617A' }}>Analysis Complete</p>
                      <h2 className="text-3xl font-black text-[#3D1520] mb-6">Your Results</h2>

                      {/* Mood Score Card */}
                      <div className={`bg-gradient-to-br ${moodGradients[insight.mood]} rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={80} /></div>
                        <div className="flex items-center justify-between relative z-10">
                          <div>
                            <p className="text-white/80 text-xs font-black uppercase tracking-widest mb-2">Your Mood Today</p>
                            <div className="flex items-center gap-4">
                              <span className="text-5xl">{insight.emoji}</span>
                              <div>
                                <h3 className="text-4xl font-black">{insight.mood}</h3>
                                <p className="text-white/70 text-xs font-semibold">Keep tracking to see your trends</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Score</p>
                            <p className="text-6xl font-black">{insight.moodScore}</p>
                            <p className="text-white/60 text-[10px] font-bold">out of 100</p>
                          </div>
                        </div>
                        {/* Score bar */}
                        <div className="mt-8 bg-black/10 rounded-full h-3 overflow-hidden border border-white/20">
                          <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${insight.moodScore}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      {/* Highlights & Concerns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {insight.highlights.length > 0 && (
                          <div className="bg-rose-50/50 border border-rose-100 rounded-[1.5rem] p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp size={16} className="text-emerald-600" />
                              <h4 className="font-black text-[#3D1520] text-xs uppercase tracking-wider">Positive Signs</h4>
                            </div>
                            <ul className="space-y-2">
                              {insight.highlights.map((h, i) => (
                                <li key={i} className="text-xs text-[#7A3545] flex items-start gap-2 font-semibold">
                                  <span className="text-emerald-500">•</span> {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {insight.concerns.length > 0 && (
                          <div className="bg-orange-50/50 border border-orange-100 rounded-[1.5rem] p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <Shield size={16} className="text-orange-600" />
                              <h4 className="font-black text-[#3D1520] text-xs uppercase tracking-wider">Things to Watch</h4>
                            </div>
                            <ul className="space-y-2">
                              {insight.concerns.map((c, i) => (
                                <li key={i} className="text-xs text-[#7A3545] flex items-start gap-2 font-semibold">
                                  <span className="text-orange-500">•</span> {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Warnings */}
                      {insight.warnings.length > 0 && (
                        <div className="bg-red-50 border-2 border-red-100 rounded-[1.5rem] p-5 mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={18} className="text-red-600" />
                            <h4 className="font-black text-red-800 text-xs uppercase tracking-wider">Important Notice</h4>
                          </div>
                          {insight.warnings.map((w, i) => (
                            <p key={i} className="text-xs text-red-700 font-bold leading-relaxed">{w}</p>
                          ))}
                        </div>
                      )}

                      {/* Suggestions */}
                      {insight.suggestions.length > 0 && (
                        <div className={`p-6 rounded-[2rem] border-2 border-rose-100/50 bg-white/50`}>
                          <div className="flex items-center gap-2 mb-4">
                            <Lightbulb size={18} className="text-[#D4617A]" />
                            <h4 className="font-black text-[#3D1520] text-xs uppercase tracking-wider">Suggestions for You</h4>
                          </div>
                          <ul className="space-y-3">
                            {insight.suggestions.map((s, i) => (
                              <li key={i} className="text-xs text-[#7A3545] flex items-start gap-3 font-semibold leading-relaxed">
                                <span className="w-5 h-5 rounded-lg flex items-center justify-center bg-[#D4617A] text-white text-[10px] flex-shrink-0">{i + 1}</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={goBack}
                disabled={step === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${step === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : 'text-[#D4617A] hover:bg-rose-100/50 active:scale-95'
                  }`}
              >
                <ArrowLeft size={16} />
                Back
              </button>

              {step < 2 ? (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-white text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#D4617A,#C44A6A)', boxShadow: '0 8px 24px rgba(212,97,122,0.32)' }}
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-white text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${saved
                    ? 'bg-emerald-500'
                    : 'hover:shadow-2xl'
                    }`}
                  style={!saved ? { background: 'linear-gradient(135deg,#D4617A,#C44A6A)', boxShadow: '0 8px 24px rgba(212,97,122,0.32)' } : {}}
                >
                  {saved ? (
                    <>
                      <CheckCircle2 size={16} />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Entry
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component matching Appointment page's button styles
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${active
      ? 'text-white shadow-md'
      : 'text-[#7A3545] opacity-60 hover:opacity-100 hover:bg-rose-50'
      }`}
    style={active ? { background: 'linear-gradient(135deg,#D4617A,#C44A6A)' } : {}}
  >
    {icon}
    {label}
  </button>
);

export default MoodTracker;