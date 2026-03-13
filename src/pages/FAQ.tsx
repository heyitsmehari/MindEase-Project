import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ_DATA = [
  {
    title: "GENERAL",
    faqs: [
      { question: "Who is this platform for?", answer: "Everyone! Here at MindEase we believe that everyone deserves to have access mental well being! " },
      { question: "Is my information really anonymous?", answer: "Yes, Here at MindEase, our team truly believes in your privacy.You are never required to share any personal identity. All chats are private and encrypted!!" },
      { question: "How do I book a counseling session?", answer: "Go to the Mentor page → choose a mentor → submit an appointment request. The mentor will reply with a suitable time." },
      { question: "Is MindEase free to use?", answer: "Yes. Our website is completely free to use!" },
      { question: "Do I need an account?", answer: "No, most features work anonymously. But having an account significantly makes your website experience better, as it keeps your data stored, helps you interact with other users etc!" },
      { question: "How can I report inappropriate content in community forum?", answer: "Our dedicated team works in a very intricate manner that avoids innapropriate contents being published, however there is also a dedicated report option so that users can report inapropriate content" },
      { question: "What if I don't know what I feel?", answer: "Our team truly beleives that not everyone may know what they feel like, and that is very normal, to address this our team has a dedicated empathetic AI chat bot that understands your feelings. Feel free to book an appointment with our expert psychologists for further assistance!!" },
    ],
  },
  {
    title: "MEDITATION & MINDFULNESS",
    faqs: [
      { question: "What is meditation and mindfulness", answer: "Here at MindEase we believe that Meditation is a practice where you focus your attention and eliminate distractions to achieve a calm and clear state of mind, the outcome of which is you being fully present and aware of your thoughts which is know as Mindfulness" },
      { question: "I've never meditated before. Is that okay?", answer: "Yes! Here at MindEase we will teach you the art of meditation from the very basics!" },
      { question: "How long should I meditate?", answer: "Meditation is an art of living, but to keep up the initial motivation it is suggested to start with 25 to 30 min of daily meditation" },
      { question: "Do I need silence?", answer: "Not necessarily, however beginners find it easier to concentrate in a quite environment" },
      { question: "What if my mind keeps wandering?", answer: "That's very normal for a beginner, with practice you will be able to control your mind slowly" },
      { question: "Best time to meditate?", answer: "You can meditate whenever you want, most importantly when your mind feels heavy and exhausted, there is no specific set time to meditate!" },
      { question: "Can meditation improve focus?", answer: "Yes, it is scientifically proven that regular meditation boosts concentration." },
      { question: "Does MindEase provide classes for meditation", answer: "Yes that is one of the core essence here at MindEase, to teach people how to meditate and build an enthusiastic community that is mentally fit" },
    ],
  },
  {
    title: "STRESS & ANXIETY",
    faqs: [
      { question: "Can this help with panic attacks?", answer: "Yes. Meditation calms and relaxes your nervous system." },
      { question: "Does mood tracking really help?", answer: "Yes, organizing and keeping track of your mood helps in keeping you calm and familiar with yourself" },
      { question: "What to do during anxiety spike?", answer: "Meditate and relax, MindEase suggests to use our AI assistant to ease yourselves" },
      { question: "Why am I stressed for no reason?", answer: "This is very common, past trauma and experiences may be the reason, try connecting with one of our experts for further assistance" },
      { question: "Does sleep affect anxiety?", answer: "Yes sleep and anxiety are connected like a vicious cycle, the more anxiety you have the poorer your sleep quality, and the poorer your sleep quality the more prone to anxiety attacks you are." },
      { question: "How often track mood?", answer: "Our experts here at MindEase believes that it is best to keep track of your mood 2-3 times in a day" },
    ],
  },
  {
    title: "PRIVACY & SAFETY",
    faqs: [
      { question: "Are my conversations stored?", answer: "Your conversation are stored in our secure and encrypted database, therefore you can truly be yourselves here at MindEase!!" },
      { question: "Can others see my stories?", answer: "You can choose between anonymous and public in our website forum community, so that no one is target, as well as people can share their inspirational stories" },
      { question: "Do counselors know my identity?", answer: "No unless you share it yourself." },
      { question: "Is my data sold?", answer: "Our fundamental rule at MindEase is to never share any data, your data is encrypted and secure here and ensured that no third party accesses it" },
      { question: "Can admins read chats?", answer: "All chats with our AI assitant is private, no human can access nor read it" },
      { question: "Can I delete my data?", answer: "Yes you are given the option to delete your data completely" },
      { question: "can I share sensitive topics and past traumas here?", answer: "Yes MindEase is a safe place where you can be yourself and share your mind at!!" },
    ],
  },
];

const GlassAccordion = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => (
  <div
    className="rounded-[2rem] overflow-hidden transition-all"
    style={{
      background: isOpen ? 'rgba(212,97,122,0.06)' : 'rgba(255,255,255,0.60)',
      border: `1.5px solid ${isOpen ? '#F4A0B0' : '#F9C5CC'}`,
      backdropFilter: 'blur(12px)',
    }}
  >
    <button
      onClick={onClick}
      className="w-full p-6 flex items-center justify-between text-left font-bold text-base"
      style={{ color: '#3D1520' }}
    >
      <span>{question}</span>
      <ChevronDown
        size={20}
        className="shrink-0 ml-4 transition-transform duration-400"
        style={{ color: '#D4617A', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div
            className="px-6 pb-6 text-sm leading-relaxed font-medium pt-0"
            style={{ color: '#7A3545', borderTop: '1.5px solid #FFE8ED' }}
          >
            <div className="pt-5">{answer}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: 'rgba(244,241,255,0.18)' }}
    >
      {/* Animated background blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{ width: 700, height: 700, top: '-15%', left: '-10%', background: 'radial-gradient(circle, rgba(249,197,204,0.45) 0%, transparent 70%)' }}
          animate={{ x: [0, 50, 0], y: [0, 35, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ width: 600, height: 600, bottom: '-10%', right: '-5%', background: 'radial-gradient(circle, rgba(232,133,154,0.30) 0%, transparent 70%)' }}
          animate={{ x: [0, -40, 0], y: [0, -25, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h1
              className="text-4xl md:text-5xl font-black mb-3 tracking-tight"
              style={{ color: '#3D1520' }}
            >
              Got Questions?{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4617A, #C44A6A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                We've Got Answers.
              </span>
            </h1>
            <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: '#7A3545', opacity: 0.7 }}>
              Everything you've been wondering about MindEase — answered honestly and openly.
            </p>

            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-3">
              {FAQ_DATA.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveCategory(i); setOpenFaq(null); }}
                  className="px-6 py-2.5 rounded-full font-bold text-sm transition-all"
                  style={
                    activeCategory === i
                      ? { background: 'linear-gradient(135deg, #D4617A, #C44A6A)', color: 'white', boxShadow: '0 4px 20px rgba(212,97,122,0.30)' }
                      : { background: 'rgba(255,255,255,0.60)', border: '1.5px solid #F9C5CC', color: '#7A3545' }
                  }
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ accordion */}
          <div className="space-y-4">
            {FAQ_DATA[activeCategory].faqs.map((f, i) => (
              <GlassAccordion
                key={i}
                question={f.question}
                answer={f.answer}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
