import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    name: string;
    isSignup?: boolean;
}

// Animated SVG — a smiling face being drawn stroke by stroke
const AnimatedFace: React.FC = () => (
    <svg
        viewBox="0 0 120 120"
        width="120"
        height="120"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Outer circle */}
        <motion.circle
            cx="60" cy="60" r="50"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        {/* Left eye */}
        <motion.circle
            cx="42" cy="48" r="5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3, type: 'spring' }}
            style={{ fill: 'white' }}
        />
        {/* Right eye */}
        <motion.circle
            cx="78" cy="48" r="5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.3, type: 'spring' }}
            style={{ fill: 'white' }}
        />
        {/* Smile */}
        <motion.path
            d="M38 72 Q60 92 82 72"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6, ease: 'easeOut' }}
        />
        {/* Left cheek blush */}
        <motion.ellipse
            cx="33" cy="70" rx="8" ry="5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            style={{ fill: '#FF8FAB', stroke: 'none' }}
        />
        {/* Right cheek blush */}
        <motion.ellipse
            cx="87" cy="70" rx="8" ry="5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ delay: 1.7, duration: 0.4 }}
            style={{ fill: '#FF8FAB', stroke: 'none' }}
        />
        {/* Sparkle top-right */}
        <motion.text
            x="90" y="22" fontSize="18" textAnchor="middle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.5, type: 'spring' }}
            style={{ fill: '#FFD700', stroke: 'none', userSelect: 'none' }}
        >
            ✨
        </motion.text>
    </svg>
);

// Floating particle emojis
const particles = ['💚', '🌸', '⭐', '✨', '💜', '🤍', '💖', '🌿'];

const WelcomeScreen: React.FC<Props> = ({ name, isSignup = false }) => {
    // Prevent background scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const firstName = name.split(' ')[0] || 'Friend';

    return (
        <AnimatePresence>
            <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #D4617A 0%, #C44A6A 40%, #9B2C5A 100%)' }}
            >
                {/* Floating background blobs */}
                <motion.div
                    className="absolute rounded-full"
                    style={{ width: 450, height: 450, top: '-10%', right: '-10%', background: 'rgba(255,255,255,0.07)' }}
                    animate={{ scale: [1, 1.12, 1], rotate: [0, 15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute rounded-full"
                    style={{ width: 350, height: 350, bottom: '-5%', left: '-8%', background: 'rgba(255,255,255,0.05)' }}
                    animate={{ scale: [1, 1.08, 1], rotate: [0, -10, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Floating emoji particles */}
                {particles.map((emoji, i) => (
                    <motion.div
                        key={i}
                        className="absolute select-none pointer-events-none text-2xl"
                        style={{
                            left: `${8 + (i * 12)}%`,
                            top: `${15 + (i % 3) * 22}%`,
                        }}
                        initial={{ y: 60, opacity: 0, scale: 0 }}
                        animate={{
                            y: [60, -20, 0, -10, 0],
                            opacity: [0, 1, 1, 0.8, 1],
                            scale: [0, 1.2, 1],
                            rotate: [0, 10, -5, 8, 0],
                        }}
                        transition={{
                            delay: 0.3 + i * 0.15,
                            duration: 2.5,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                        }}
                    >
                        {emoji}
                    </motion.div>
                ))}

                {/* Main content */}
                <div className="relative z-10 flex flex-col items-center text-center px-6">
                    {/* Animated face */}
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                        className="mb-8 p-6 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                    >
                        <AnimatedFace />
                    </motion.div>

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.6, ease: 'easeOut' }}
                    >
                        <p className="text-pink-100 text-sm font-black uppercase tracking-[0.25em] mb-2">
                            {isSignup ? '🎉 Welcome aboard!' : '👋 Welcome back!'}
                        </p>
                        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-2">
                            {firstName}
                        </h1>
                        <h2 className="text-2xl font-black mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                            to <span className="text-white">Mind</span><span style={{ color: '#FFD6DE' }}>Ease</span>
                        </h2>
                        <motion.p
                            className="text-pink-100/80 text-base max-w-xs mx-auto font-medium leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.9 }}
                        >
                            {isSignup
                                ? 'Your journey to better mental wellness starts right now. 🌱'
                                : 'Great to have you back. Your peace of mind matters. 💚'}
                        </motion.p>
                    </motion.div>

                    {/* Loading dots */}
                    <motion.div
                        className="flex gap-2 mt-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.2 }}
                    >
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-white/60"
                                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity }}
                            />
                        ))}
                    </motion.div>
                    <motion.p
                        className="mt-3 text-pink-100/60 text-xs font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.4 }}
                    >
                        Taking you to your dashboard…
                    </motion.p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WelcomeScreen;
