import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    // Special case: FAQ anchor link → navigate to home and scroll to #faq
    if (path === '/#faq') {
      if (location.pathname === '/') {
        // Already on home page: just scroll to the faq section
        const el = document.getElementById('faq');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to home, then scroll after render
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById('faq');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 350);
      }
      return;
    }

    if (location.pathname === path) {
      // Same page → scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Different page → navigate then scroll to top
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="pt-16 pb-8 px-6 bg-[#0F172A]">

      <div className="max-w-7xl mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-700">
                <Brain size={20} className="text-white" />
              </div>

              <span className="text-xl font-bold text-white">
                Mind<span className="text-pink-400">Ease</span>
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Your safe, anonymous mental wellness companion built for NITK students.
            </p>

            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-800 text-gray-400 hover:text-pink-400 transition"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Quick Links</h4>

            <ul className="space-y-3">
              {[
                { text: 'About Us', path: '/about' },
                { text: 'AI Chatbot', path: '/chatbot' },
                { text: 'Mood Tracker', path: '/mood' },
                { text: 'Guided Sessions', path: '/sessions' },
                { text: 'Events', path: '/events' },
                { text: 'Community', path: '/community' },
              ].map((l, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleNav(l.path)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition"
                  >
                    <ArrowRight size={13} />
                    {l.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-5">Resources</h4>

            <ul className="space-y-3">
              {[
                { text: 'Mental Health Tips', path: '/resources' },
                { text: 'Emergency Help', path: '/emergency' },
                { text: 'FAQs', path: '/#faq' },
                { text: 'Meet Our Mentors', path: '/mentor' },
              ].map((l, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleNav(l.path)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition"
                  >
                    <ArrowRight size={13} />
                    {l.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5">Contact</h4>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-pink-400 mt-1" />
                <span className="text-sm text-gray-400">
                  support@mindease.nitkkr.ac.in
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Phone size={16} className="text-pink-400 mt-1" />
                <span className="text-sm text-gray-400">
                  +91 XXXXX XXXXX
                </span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-pink-400 mt-1" />
                <span className="text-sm text-gray-400">
                  NIT Kurukshetra, Haryana, India
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-pink-500/20 mb-6"></div>

        {/* Bottom bar */}
        <div className="text-center text-xs text-gray-500">
          © 2026 MindEase. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;