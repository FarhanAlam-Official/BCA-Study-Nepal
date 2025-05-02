/**
 * Main Application Component
 * 
 * Handles the core application structure including:
 * - Routing configuration
 * - Layout components (Navbar, Footer)
 * - Global providers (Auth, Pomodoro)
 * - Lazy loading of components
 */

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Direct imports for core components
import Settings from './pages/Settings';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import UsefulLinks from './components/home/UsefulLinks';
import LoadingPage from './components/common/LoadingPage';

// Context Providers
import { PomodoroProvider } from './context/PomodoroContext';
import { AuthProvider } from './context/AuthContext';

/**
 * Lazy loaded components
 * These components are loaded only when needed to improve initial load time
 */
const Notes = lazy(() => import('./pages/notes'));
const CollegePage = lazy(() => import('./pages/colleges'));
const Career = lazy(() => import('./pages/career'));
const Contact = lazy(() => import('./pages/contact'));
const CollegeDetail = lazy(() => import('./components/college/CollegeDetail'));
const QuestionPapers = lazy(() => import('./pages/question-papers'));
const QuestionPapersPapers = lazy(() => import('./pages/question-papers/papers'));
const Syllabus = lazy(() => import('./pages/syllabus'));
const GPACalculator = lazy(() => import('./pages/tools/GPACalculator'));
const Pomodoro = lazy(() => import('./pages/tools/Pomodoro'));
const Todo = lazy(() => import('./pages/tools/Todo'));
const PDFViewerWrapper = lazy(() => import('./components/common/PDFViewerWrapper'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Profile = lazy(() => import('./pages/profile'));
const ResourceRadar = lazy(() => import('./pages/resource-radar'));

/**
 * HomePage Component
 * Renders the main landing page with Hero, Features, and UsefulLinks sections
 */
const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <UsefulLinks />
    </>
  );
};

/**
 * AppContent Component
 * Main application wrapper that includes:
 * - Pomodoro context provider
 * - Layout structure
 * - Route definitions
 * - Global notifications
 */
const AppContent: React.FC = () => {
  return (
    <PomodoroProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              
              {/* College Routes */}
              <Route path="/colleges" element={<CollegePage />} />
              <Route path="/colleges/:id" element={<CollegeDetail />} />
              
              {/* Information Pages */}
              <Route path="/career" element={<Career />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/syllabus" element={<Syllabus />} />
              
              {/* Tool Routes */}
              <Route path="/tools/gpa-calculator" element={<GPACalculator />} />
              <Route path="/tools/pomodoro" element={<Pomodoro />} />
              <Route path="/tools/todo" element={<Todo />} />
              
              {/* Study Material Routes */}
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/:id" element={<Notes />} />
              <Route path="/viewer/:pdfUrl/:subject" element={<PDFViewerWrapper />} />
              <Route path="/question-papers" element={<QuestionPapers />} />
              <Route path="/question-papers/:subjectId/:subjectName/papers" element={<QuestionPapersPapers />} />
              <Route path="/resource-radar" element={<ResourceRadar />} />
              
              {/* Authentication Routes */}
              <Route path="/auth" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        
        {/* Global Toast Container */}
        <ToastContainer
          containerId="global-notifications"
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{marginTop: '5rem'}}
        />
      </div>
    </PomodoroProvider>
  );
};

/**
 * Root App Component
 * Wraps the entire application with necessary providers:
 * - Router for navigation
 * - Auth provider for authentication state
 */
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
