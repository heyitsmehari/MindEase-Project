import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  desc: string;
  location?: string;
  registrationLink?: string;
  lastDate?: string;
  startDate?: string;
  createdAt?: any;
}

const EventsAndSessions: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    // No orderBy on the query — avoids needing a Firestore composite index.
    // We sort client-side instead.
    const unsubscribe = onSnapshot(
      collection(db, "events"),
      (snapshot) => {
        const fetchedEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];

        // Sort newest first using the createdAt timestamp if available
        fetchedEvents.sort((a, b) => {
          const tA = a.createdAt?.seconds ?? 0;
          const tB = b.createdAt?.seconds ?? 0;
          return tB - tA;
        });

        setEvents(fetchedEvents);
        setLoading(false);
        setFetchError(null);
      },
      (error) => {
        console.error("Error fetching events:", error);
        setFetchError("Could not load events. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleRegister = (event: Event) => {
    if (event.registrationLink) {
      window.open(event.registrationLink, '_blank');
    } else {
      setSelectedEvent(event);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4" style={{ background: '#FFF5F7' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider mb-4"
            style={{
              background: 'rgba(212,97,122,0.08)',
              color: '#D4617A'
            }}
          >
            <Sparkles size={16} />
            Community Events & Sessions
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg,#D4617A,#C44A6A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Upcoming Events
          </h1>

          <p style={{ color: '#7A3545' }} className="text-lg max-w-xl mx-auto">
            Join mental wellness events, workshops, and community therapy sessions
          </p>
        </div>

        {/* Events */}
        <div className="grid md:grid-cols-2 gap-5">

          {loading ? (
            <div
              className="p-10 rounded-2xl text-center col-span-full"
              style={{
                background: 'rgba(255,255,255,0.85)',
                boxShadow: '0 10px 35px rgba(212,97,122,0.08)'
              }}
            >
              <div className="w-10 h-10 border-4 border-[#D4617A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p style={{ color: '#7A3545' }} className="font-semibold">Loading events...</p>
            </div>

          ) : fetchError ? (
            <div
              className="p-10 rounded-2xl text-center col-span-full"
              style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}
            >
              <AlertCircle className="mx-auto mb-4" size={40} style={{ color: '#F4A0B0' }} />
              <h3 style={{ color: '#3D1520' }} className="text-xl font-bold mb-1">Unable to Load Events</h3>
              <p style={{ color: '#7A3545' }}>{fetchError}</p>
            </div>

          ) : events.length === 0 ? (
            <div
              className="p-10 rounded-2xl text-center col-span-full"
              style={{
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.05)'
              }}
            >
              <Calendar className="mx-auto mb-4" size={40} style={{ color: '#F4A0B0' }} />
              <h3 style={{ color: '#3D1520' }} className="text-xl font-bold mb-1">No Events Scheduled</h3>
              <p style={{ color: '#7A3545' }}>Check back soon for upcoming events!</p>
            </div>

          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="p-5 rounded-2xl group transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 10px 35px rgba(212,97,122,0.08)'
                }}
              >

                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: 'rgba(212,97,122,0.12)',
                      color: '#D4617A'
                    }}
                  >
                    <Calendar size={20} />
                  </div>

                  <span
                    className="text-xs font-bold px-3 py-1 rounded-lg"
                    style={{
                      background: 'rgba(34,197,94,0.12)',
                      color: '#16A34A'
                    }}
                  >
                    OPEN
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: '#3D1520' }}
                >
                  {event.title}
                </h3>

                {/* Details */}
                <div className="space-y-1 text-sm mb-3">

                  {event.startDate && (
                    <div className="flex items-center gap-2" style={{ color: '#7A3545' }}>
                      <Calendar size={14} />
                      Starts: {event.startDate}
                    </div>
                  )}

                  {event.date && (
                    <div className="flex items-center gap-2" style={{ color: '#7A3545' }}>
                      <Clock size={14} />
                      {event.date}
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-2" style={{ color: '#7A3545' }}>
                      <MapPin size={14} />
                      {event.location}
                    </div>
                  )}

                  {event.lastDate && (
                    <div
                      className="flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-semibold"
                      style={{
                        background: 'rgba(251,146,60,0.12)',
                        color: '#EA580C'
                      }}
                    >
                      <AlertCircle size={14} />
                      Last Date: {event.lastDate}
                    </div>
                  )}

                </div>

                <p style={{ color: '#7A3545' }} className="text-sm mb-4 line-clamp-2">
                  {event.desc}
                </p>

                {/* Button */}
                <button
                  onClick={() => handleRegister(event)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: 'linear-gradient(135deg,#D4617A,#C44A6A)',
                    color: 'white'
                  }}
                >
                  {event.registrationLink ? (
                    <>
                      <ExternalLink size={16} />
                      Register
                    </>
                  ) : (
                    'View Details'
                  )}
                </button>

              </div>
            ))
          )}

        </div>

        {/* Therapy Sessions Section */}
        <div
          className="mt-12 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: 'linear-gradient(135deg,#D4617A,#C44A6A)',
            color: 'white'
          }}
        >
          <div>
            <h3 className="text-xl font-bold mb-1">Explore Therapy Sessions</h3>
            <p className="text-sm opacity-90">
              Access guided sessions and mental wellness videos designed for students.
            </p>
          </div>

          <a
            href="/sessions"
            className="px-6 py-3 rounded-xl font-semibold bg-white"
            style={{ color: '#D4617A' }}
          >
            View Sessions
          </a>
        </div>

      </div>

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl p-7 max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#3D1520' }} className="text-2xl font-bold mb-3">
              {selectedEvent.title}
            </h2>

            <p style={{ color: '#7A3545' }} className="mb-4">
              {selectedEvent.desc}
            </p>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2.5 rounded-xl text-white font-semibold"
              style={{ background: '#D4617A' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventsAndSessions;