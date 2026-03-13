import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CalendarPlus, Send, Video, Clock, Users, BookOpen } from 'lucide-react';

const ManageEvents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'videos' | 'bookings' | 'books'>('events');

  // Event form state
  const [event, setEvent] = useState({
    title: '',
    date: '',
    desc: '',
    location: '',
    registrationLink: '',
    pdfLink: '',
    lastDate: '',
    startDate: ''
  });

  // Video Session form state
  const [videoSession, setVideoSession] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    category: 'meditation'
  });

  // Book form state
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: 'self-help',
    description: '',
    link: '',
    coverUrl: ''
  });

  // Bookable Session form state
  const [bookableSession, setBookableSession] = useState({
    title: '',
    description: '',
    therapistName: '',
    sessionType: 'individual',
    duration: '',
    availableSlots: '',
    price: ''
  });

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "events"), {
        ...event,
        createdAt: serverTimestamp()
      });
      setEvent({
        title: '',
        date: '',
        desc: '',
        location: '',
        registrationLink: '',
        pdfLink: '',
        lastDate: '',
        startDate: ''
      });
      alert("Event Added Successfully!");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event!");
    }
  };

  const handleAddVideoSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "videoSessions"), {
        ...videoSession,
        createdAt: serverTimestamp()
      });
      setVideoSession({
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        category: 'meditation'
      });
      alert("Video Session Added Successfully!");
    } catch (error) {
      console.error("Error adding video session:", error);
      alert("Error adding video session!");
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'books'), {
        ...book,
        createdAt: serverTimestamp()
      });
      setBook({ title: '', author: '', genre: 'self-help', description: '', link: '', coverUrl: '' });
      alert('Book Added Successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Error adding book!');
    }
  };

  const handleAddBookableSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bookableSessions"), {
        ...bookableSession,
        createdAt: serverTimestamp()
      });
      setBookableSession({
        title: '',
        description: '',
        therapistName: '',
        sessionType: 'individual',
        duration: '',
        availableSlots: '',
        price: ''
      });
      alert("Bookable Session Added Successfully!");
    } catch (error) {
      console.error("Error adding bookable session:", error);
      alert("Error adding bookable session!");
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all text-sm ${activeTab === 'events'
            ? 'bg-white text-blue-600 shadow-md'
            : 'text-gray-600 hover:text-blue-600'
            }`}
        >
          <CalendarPlus className="inline mr-2" size={18} />
          Events
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all text-sm ${activeTab === 'videos'
            ? 'bg-white text-purple-600 shadow-md'
            : 'text-gray-600 hover:text-purple-600'
            }`}
        >
          <Video className="inline mr-2" size={18} />
          Video Sessions
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all text-sm ${activeTab === 'bookings'
            ? 'bg-white text-green-600 shadow-md'
            : 'text-gray-600 hover:text-green-600'
            }`}
        >
          <Users className="inline mr-2" size={18} />
          Bookable Sessions
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all text-sm ${activeTab === 'books'
            ? 'bg-white text-amber-600 shadow-md'
            : 'text-gray-600 hover:text-amber-600'
            }`}
        >
          <BookOpen className="inline mr-2" size={18} />
          Books
        </button>
      </div>

      {/* Events Form */}
      {activeTab === 'events' && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CalendarPlus className="text-blue-600" /> Create New Event
          </h2>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <input
              placeholder="Event Title"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              value={event.title}
              onChange={e => setEvent({ ...event, title: e.target.value })}
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Start Date</label>
                <input
                  type="text"
                  placeholder="e.g., Feb 15, 2026"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={event.startDate}
                  onChange={e => setEvent({ ...event, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Event Time</label>
                <input
                  type="text"
                  placeholder="e.g., 3:00 PM - 5:00 PM"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={event.date}
                  onChange={e => setEvent({ ...event, date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Main Auditorium or Online"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={event.location}
                  onChange={e => setEvent({ ...event, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Last Registration Date</label>
                <input
                  type="text"
                  placeholder="e.g., Feb 10, 2026"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={event.lastDate}
                  onChange={e => setEvent({ ...event, lastDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Registration Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://forms.google.com/..."
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={event.registrationLink}
                  onChange={e => setEvent({ ...event, registrationLink: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">PDF Document Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={event.pdfLink}
                  onChange={e => setEvent({ ...event, pdfLink: e.target.value })}
                />
              </div>
            </div>

            <textarea
              placeholder="Event Description..."
              className="w-full h-32 p-4 bg-gray-50 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-blue-500"
              value={event.desc}
              onChange={e => setEvent({ ...event, desc: e.target.value })}
              required
            />

            <button className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-all">
              <Send size={18} /> Publish Event
            </button>
          </form>
        </div>
      )}

      {/* Video Sessions Form */}
      {activeTab === 'videos' && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Video className="text-purple-600" /> Add Video Session
          </h2>
          <form onSubmit={handleAddVideoSession} className="space-y-4">
            <input
              placeholder="Video Session Title"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
              value={videoSession.title}
              onChange={e => setVideoSession({ ...videoSession, title: e.target.value })}
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Category</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
                  value={videoSession.category}
                  onChange={e => setVideoSession({ ...videoSession, category: e.target.value })}
                  required
                >
                  <option value="meditation">🧘 Meditation</option>
                  <option value="therapy">💬 Therapy</option>
                  <option value="coping">🛡️ Coping Strategies</option>
                  <option value="general">📚 General</option>
                  <option value="yoga">🌿 Yoga</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 15 min"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
                  value={videoSession.duration}
                  onChange={e => setVideoSession({ ...videoSession, duration: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block">YouTube Video URL</label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
                value={videoSession.videoUrl}
                onChange={e => setVideoSession({ ...videoSession, videoUrl: e.target.value })}
                required
              />
            </div>

            <textarea
              placeholder="Video Description..."
              className="w-full h-32 p-4 bg-gray-50 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-purple-500"
              value={videoSession.description}
              onChange={e => setVideoSession({ ...videoSession, description: e.target.value })}
              required
            />

            <button className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-all">
              <Send size={18} /> Add Video Session
            </button>
          </form>
        </div>
      )}

      {/* Books Form */}
      {activeTab === 'books' && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="text-amber-600" /> Add Recommended Book
          </h2>
          <form onSubmit={handleAddBook} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Book Title</label>
                <input
                  placeholder="e.g., The Anxiety and Worry Workbook"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400"
                  value={book.title}
                  onChange={e => setBook({ ...book, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Author</label>
                <input
                  placeholder="e.g., Clark & Beck"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400"
                  value={book.author}
                  onChange={e => setBook({ ...book, author: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Genre</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400"
                  value={book.genre}
                  onChange={e => setBook({ ...book, genre: e.target.value })}
                  required
                >
                  <option value="self-help">📗 Self Help</option>
                  <option value="anxiety">😰 Anxiety & Stress</option>
                  <option value="mindfulness">🧘 Mindfulness</option>
                  <option value="depression">💙 Depression</option>
                  <option value="relationships">❤️ Relationships</option>
                  <option value="productivity">⚡ Productivity</option>
                  <option value="general">📚 General</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Book / Buy Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://amazon.in/... or Google Books link"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400"
                  value={book.link}
                  onChange={e => setBook({ ...book, link: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block">Cover Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com/cover.jpg"
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400"
                value={book.coverUrl}
                onChange={e => setBook({ ...book, coverUrl: e.target.value })}
              />
            </div>


            <textarea
              placeholder="Short description of what this book is about and why it helps..."
              className="w-full h-28 p-4 bg-gray-50 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-amber-400"
              value={book.description}
              onChange={e => setBook({ ...book, description: e.target.value })}
              required
            />

            <button className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-all">
              <Send size={18} /> Add Book
            </button>
          </form>
        </div>
      )}

      {/* Bookable Sessions Form */}
      {activeTab === 'bookings' && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="text-green-600" /> Create Bookable Session
          </h2>
          <form onSubmit={handleAddBookableSession} className="space-y-4">
            <input
              placeholder="Session Title (e.g., Individual Therapy)"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
              value={bookableSession.title}
              onChange={e => setBookableSession({ ...bookableSession, title: e.target.value })}
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Therapist Name</label>
                <input
                  type="text"
                  placeholder="e.g., Dr. Sarah Johnson"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                  value={bookableSession.therapistName}
                  onChange={e => setBookableSession({ ...bookableSession, therapistName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Session Type</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                  value={bookableSession.sessionType}
                  onChange={e => setBookableSession({ ...bookableSession, sessionType: e.target.value })}
                  required
                >
                  <option value="individual">Individual Therapy</option>
                  <option value="group">Group Therapy</option>
                  <option value="peer">Peer Support</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 45 min"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                  value={bookableSession.duration}
                  onChange={e => setBookableSession({ ...bookableSession, duration: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Available Slots</label>
                <input
                  type="text"
                  placeholder="e.g., Mon-Fri 2-5 PM"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                  value={bookableSession.availableSlots}
                  onChange={e => setBookableSession({ ...bookableSession, availableSlots: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Price</label>
                <input
                  type="text"
                  placeholder="e.g., Free or ₹500"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                  value={bookableSession.price}
                  onChange={e => setBookableSession({ ...bookableSession, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <textarea
              placeholder="Session Description..."
              className="w-full h-32 p-4 bg-gray-50 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-green-500"
              value={bookableSession.description}
              onChange={e => setBookableSession({ ...bookableSession, description: e.target.value })}
              required
            />

            <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all">
              <Send size={18} /> Publish Bookable Session
            </button>
          </form>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Clock size={18} />
          Quick Tips
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          {activeTab === 'events' ? (
            <>
              <li>• Add registration links for easy sign-ups</li>
              <li>• Include clear start dates and deadlines</li>
              <li>• Events appear on /events page</li>
            </>
          ) : activeTab === 'videos' ? (
            <>
              <li>• Use YouTube URLs for educational videos</li>
              <li>• Choose appropriate category</li>
              <li>• Videos appear on /sessions page</li>
            </>
          ) : activeTab === 'books' ? (
            <>
              <li>• Add book cover URL from Google Books or Amazon</li>
              <li>• Include a link to where students can read or buy it</li>
              <li>• Books appear on /resources page under Books tab</li>
            </>
          ) : (
            <>
              <li>• Create bookable therapy sessions</li>
              <li>• Specify therapist and availability</li>
              <li>• Sessions appear on /appointment page</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManageEvents;