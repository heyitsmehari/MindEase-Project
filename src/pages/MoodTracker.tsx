import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Heart, Lightbulb, LayoutDashboard,
  ArrowRight, ArrowLeft, Save, CheckCircle2,
  AlertTriangle, TrendingUp, Shield,
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

const moodGradients: Record<string, string> = {
  Distressed: 'from-red-500 to-rose-600',
  'Low Mood': 'from-orange-400 to-amber-500',
  Neutral: 'from-[#F4A0B0] to-[#D4617A]',
  Positive: 'from-[#D4617A] to-[#C44A6A]',
  'Very Positive': 'from-[#C44A6A] to-[#9B2C5A]',
};

const moodBg: Record<string, string> = {
  Distressed: 'bg-red-50 border-red-200',
  'Low Mood': 'bg-amber-50 border-amber-200',
  Neutral: 'bg-[#FFE8ED] border-[#F9C5CC]',
  Positive: 'bg-[#FFE8ED] border-[#F9C5CC]',
  'Very Positive': 'bg-[#FFE8ED] border-[#F9C5CC]',
};

const MoodTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('log');
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [saved, setSaved] = useState(false);

  const [moodData, setMoodData] = useState<MoodFormData>({
    energy: 5,
    sleep: 5,
    difficultyStart: 5,
    tiredness: 5,
    focus: 5,
    workloadStress: 5,
    productivity: 5,
  });

  const [behavioralData, setBehavioralData] = useState<BehavioralFormData>({
    calm: 5,
    irritation: 5,
    hopeful: 5,
    connected: 5,
    lonely: 5,
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
      setMoodData({
        energy: 5,
        sleep: 5,
        difficultyStart: 5,
        tiredness: 5,
        focus: 5,
        workloadStress: 5,
        productivity: 5,
      });

      setBehavioralData({
        calm: 5,
        irritation: 5,
        hopeful: 5,
        connected: 5,
        lonely: 5,
      });

      setInsight(null);
      setActiveTab('dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">

      {/* HEADER */}
      <section className="bg-gradient-to-br from-[#E88FA3] via-[#D4617A] to-[#C96B84] pt-20 pb-16 px-6 relative overflow-hidden">

        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-[#F4A0B0] rounded-full opacity-20 blur-[120px]" />

        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] h-[300px] bg-[#F9C5CC] rounded-full opacity-20 blur-[100px]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Mood Tracker
          </h1>

          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Answer a few quick questions about your day and get personalized insights about your well-being.
          </p>

        </div>
      </section>


      {/* TAB SWITCHER */}

      <div className="max-w-4xl mx-auto px-6 -mt-6 relative z-20">

        <div className="bg-white rounded-2xl shadow-lg border border-[#F9C5CC] p-1.5 flex gap-1">

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


      {/* CONTENT */}

      <div className="max-w-4xl mx-auto px-6 py-8">

        {activeTab === 'dashboard' ? (
          <MoodDashboard />
        ) : (
          <div>

            {/* STEP INDICATOR */}

            <div className="flex items-center justify-center gap-2 mb-8">

              {STEPS.map(({ id, label, icon: Icon }) => (

                <React.Fragment key={id}>

                  <div className="flex items-center gap-2">

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                      ${step === id
                        ? 'bg-[#D4617A] text-white shadow-lg scale-110'
                        : step > id
                        ? 'bg-[#C44A6A] text-white'
                        : 'bg-[#FFE8ED] text-[#7A3545]'
                      }`}
                    >
                      {step > id ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                    </div>

                    <span
                      className={`text-sm font-semibold hidden sm:block
                      ${step === id
                        ? 'text-[#D4617A]'
                        : step > id
                        ? 'text-[#C44A6A]'
                        : 'text-[#7A3545]'
                      }`}
                    >
                      {label}
                    </span>

                  </div>

                  {id < 2 && (
                    <div
                      className={`w-12 h-0.5 rounded-full
                      ${step > id
                        ? 'bg-[#C44A6A]'
                        : 'bg-[#F9C5CC]'
                      }`}
                    />
                  )}

                </React.Fragment>

              ))}

            </div>


            {/* STEP CONTENT */}

            <div className="bg-white rounded-2xl border border-[#F9C5CC] shadow-lg p-6 md:p-8 min-h-[400px] overflow-hidden">

              <AnimatePresence mode="wait" custom={direction}>

                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                >

                  {step === 0 && (
                    <>
                      <h2 className="text-2xl font-bold text-[#3D1520] mb-1">
                        How's your day going?
                      </h2>
                      <p className="text-[#7A3545] mb-6">
                        Rate each question from 1–10.
                      </p>

                      <MoodForm data={moodData} onChange={setMoodData} />
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <h2 className="text-2xl font-bold text-[#3D1520] mb-1">
                        How do you feel emotionally?
                      </h2>
                      <p className="text-[#7A3545] mb-6">
                        A few questions about your emotional state.
                      </p>

                      <BehavioralForm data={behavioralData} onChange={setBehavioralData} />
                    </>
                  )}

                  {step === 2 && insight && (
                    <div>

                      <h2 className="text-2xl font-bold text-[#3D1520] mb-1">
                        Your Results
                      </h2>

                      <p className="text-[#7A3545] mb-6">
                        Here's how you're doing today.
                      </p>


                      {/* SCORE CARD */}

                      <div className={`bg-gradient-to-br ${moodGradients[insight.mood]} rounded-2xl p-6 text-white shadow-xl mb-6`}>

                        <div className="flex justify-between">

                          <div>

                            <p className="text-white/80 text-sm mb-1">
                              Your Mood Today
                            </p>

                            <div className="flex gap-3 items-center">

                              <span className="text-4xl">
                                {insight.emoji}
                              </span>

                              <div>

                                <h3 className="text-3xl font-extrabold">
                                  {insight.mood}
                                </h3>

                                <p className="text-white/70 text-sm">
                                  Keep tracking to see trends
                                </p>

                              </div>

                            </div>

                          </div>

                          <div className="text-right">

                            <p className="text-xs text-white/60 uppercase">
                              Score
                            </p>

                            <p className="text-5xl font-extrabold">
                              {insight.moodScore}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                </motion.div>

              </AnimatePresence>

            </div>


            {/* NAVIGATION */}

            <div className="flex justify-between mt-6">

              <button
                onClick={goBack}
                disabled={step === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[#7A3545] hover:bg-[#FFE8ED]"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              {step < 2 ? (

                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-[#D4617A] hover:bg-[#C44A6A]"
                >
                  Next
                  <ArrowRight size={18} />
                </button>

              ) : (

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#D4617A] to-[#C44A6A]"
                >
                  <Save size={18} />
                  Save Entry
                </button>

              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
};


const TabButton = ({ active, onClick, icon, label }: any) => (

  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
    ${active
      ? 'bg-[#D4617A] text-white shadow-md'
      : 'text-[#7A3545] hover:bg-[#FFE8ED]'
    }`}
  >
    {icon}
    {label}
  </button>

);

export default MoodTracker;