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
    link: ''
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
      setBook({ title: '', author: '', genre: 'self-help', description: '', link: '' });
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
            <CalendarPlus className="text-blue-600" /> Add Event
          </h2>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Event Title</label>
                <input
                  placeholder="e.g., Mental Health Awareness"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
                  value={event.title}
                  onChange={e => setEvent({ ...event, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Event Date</label>
                <input
                  type="date"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
                  value={event.date}
                  onChange={e => setEvent({ ...event, date: e.target.value })}
                  required
                />
              </div>
            </div>
            <textarea
              placeholder="Event Description"
              className="w-full h-28 p-4 bg-gray-50 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-blue-400"
              value={event.desc}
              onChange={e => setEvent({ ...event, desc: e.target.value })}
              required
            />
            <button className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
              <Send size={18} /> Add Event
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
    </div>
  );
};

export default ManageEvents;