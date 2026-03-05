import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Users, ArrowRight } from 'lucide-react';

export default function Community() {
  return (
    <div className="min-h-screen py-20 px-4" style={{ background: '#FFF5F7' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg,#D4617A,#C44A6A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Community Hub
          </h1>

          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: '#7A3545' }}
          >
            Connect with others, join events, and participate in supportive discussions
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">

          {/* Events Card */}
          <Link
            to="/events"
            className="group p-6 rounded-2xl transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 35px rgba(212,97,122,0.08)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  background: 'rgba(212,97,122,0.12)',
                  color: '#D4617A',
                }}
              >
                <Calendar size={26} />
              </div>

              <ArrowRight
                size={22}
                className="transition-all group-hover:translate-x-1"
                style={{ color: '#D4617A' }}
              />
            </div>

            <h2
              className="text-xl font-bold mb-2"
              style={{ color: '#3D1520' }}
            >
              Events & Sessions
            </h2>

            <p
              className="text-sm leading-relaxed"
              style={{ color: '#7A3545' }}
            >
              Browse upcoming wellness events, workshops, and group therapy
              sessions. Connect and participate in guided activities.
            </p>

            <div
              className="mt-5 flex items-center gap-2 text-sm font-semibold"
              style={{ color: '#D4617A' }}
            >
              <span>View Events</span>
              <ArrowRight size={16} />
            </div>
          </Link>

          {/* Stories Card */}
          <Link
            to="/stories"
            className="group p-6 rounded-2xl transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 35px rgba(212,97,122,0.08)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  background: 'rgba(212,97,122,0.12)',
                  color: '#D4617A',
                }}
              >
                <MessageSquare size={26} />
              </div>

              <ArrowRight
                size={22}
                className="transition-all group-hover:translate-x-1"
                style={{ color: '#D4617A' }}
              />
            </div>

            <h2
              className="text-xl font-bold mb-2"
              style={{ color: '#3D1520' }}
            >
              Stories & Discussions
            </h2>

            <p
              className="text-sm leading-relaxed"
              style={{ color: '#7A3545' }}
            >
              Read inspiring stories from others, share your journey, and join
              thoughtful discussions with a supportive community.
            </p>

            <div
              className="mt-5 flex items-center gap-2 text-sm font-semibold"
              style={{ color: '#D4617A' }}
            >
              <span>Join Discussions</span>
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div
          className="mt-10 p-6 rounded-2xl max-w-3xl mx-auto flex gap-4"
          style={{
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
          }}
        >
          <div
            className="p-3 rounded-xl"
            style={{
              background: 'rgba(212,97,122,0.12)',
              color: '#D4617A',
            }}
          >
            <Users size={24} />
          </div>

          <div>
            <h3
              className="text-lg font-bold mb-1"
              style={{ color: '#3D1520' }}
            >
              Safe & Supportive Space
            </h3>

            <p
              className="text-sm leading-relaxed"
              style={{ color: '#7A3545' }}
            >
              Our community is built on empathy, respect, and confidentiality.
              Everyone’s journey is unique, and we’re here to support one
              another through every stage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}