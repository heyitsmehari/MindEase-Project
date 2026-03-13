import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Pages
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import MoodTracker from './pages/MoodTracker';
import Sessions from './pages/Sessions';
import Blog from './pages/Blog';
import EventsAndSessions from './pages/Events';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import StudentDashboard from './pages/Dashboard/StudentDashboard'; // 🆕 Import Student Dashboard

// New Pages
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import Emergency from './pages/Emergency';
import Mentor from './pages/Mentor';
import MentorDetail from './pages/MentorDetail';
import Resources from './pages/Resources';
import Appointment from './pages/Appointment';
import Community from './pages/Community';
import Team from './pages/Team';
import AlumniProfessorDashboard from './pages/Dashboard/AlumniProfessorDashboard';
import UserProfile from './pages/UserProfile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ApproveStories from './pages/admin/Approve';
import ManageEvents from './pages/admin/ManageEvents';
import ViewEvents from './pages/admin/ViewEvents';
import ViewVideos from './pages/admin/ViewVideos';
import ViewSessions from './pages/admin/ViewSessions';
import ViewBooks from './pages/admin/ViewBooks';

const AppContent: React.FC = () => {
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Navbar & Footer sirf normal pages par dikhenge */}
      {!isAuthPage && !isAdminPage && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/team" element={<Team />} />

          {/* 🔐 Protected Student Routes */}
          <Route path="/mentor" element={<ProtectedRoute><Mentor /></ProtectedRoute>} />
          <Route path="/mentor/:id" element={<ProtectedRoute><MentorDetail /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/appointment" element={<ProtectedRoute><Appointment /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/mood" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
          <Route path="/stories" element={<ProtectedRoute><Blog /></ProtectedRoute>} />

          <Route path="/events" element={<ProtectedRoute><EventsAndSessions /></ProtectedRoute>} />

          {/* 🆕 Student Dashboard Route */}
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/alumni-dashboard" element={<ProtectedRoute><AlumniProfessorDashboard role="alumni" /></ProtectedRoute>} />
          <Route path="/professor-dashboard" element={<ProtectedRoute><AlumniProfessorDashboard role="professor" /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

          {/* 👑 Admin Nested Routes with Sidebar Layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Ye pages AdminLayout ke <Outlet /> mein load honge */}
            <Route index element={<AdminDashboard />} />
            <Route path="approve" element={<ApproveStories />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="view-events" element={<ViewEvents />} />
            <Route path="view-videos" element={<ViewVideos />} />
            <Route path="view-sessions" element={<ViewSessions />} />
            <Route path="view-books" element={<ViewBooks />} />
          </Route>
        </Routes>
      </main>

      {!isAuthPage && !isAdminPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;