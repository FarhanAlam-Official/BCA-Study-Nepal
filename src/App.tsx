/**
 * Main Application Component
 * 
 * Core application structure that handles:
 * - Routing configuration with HashRouter
 * - Global layout components (Navbar, Footer)
 * - Context providers (Auth, Pomodoro)
 * - Component lazy loading for performance
 * - Global notification system
 * 
 * Architecture:
 * - Uses HashRouter for consistent routing across deployments
 * - Implements code splitting via lazy loading
 * - Provides centralized state management through context
 * - Maintains consistent layout structure
 * - Handles global notifications via ToastContainer
 */

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Direct imports for core components that are needed immediately
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import UsefulLinks from './components/home/UsefulLinks';
import LoadingPage from './components/common/LoadingPage';

// Context Providers for global state management
import { PomodoroProvider } from './context/PomodoroContext';
import { AuthProvider } from './context/AuthContext';

/**
 * Lazy loaded components for better initial load performance
 * Components are loaded on-demand when their routes are accessed
 * Each import is wrapped in lazy() for code splitting
 */
const Notes = lazy(() => import('./pages/notes'));
const CollegePage = lazy(() => import('./pages/colleges'));
const Career = lazy(() => import('./pages/career'));
const Contact = lazy(() => import('./pages/contact'));
const CollegeDetail = lazy(() => import('./components/college/CollegeDetail'));
const QuestionPapers = lazy(() => import('./pages/question-papers'));
const QuestionPapersPapers = lazy(() => import('./pages/question-papers/papers'));
const SyllabusList = lazy(() => import('./pages/syllabus'));
const SubjectSyllabusList = lazy(() => import('./components/syllabus/SyllabusList'));
const GPACalculator = lazy(() => import('./pages/tools/GPACalculator'));
const Pomodoro = lazy(() => import('./pages/tools/Pomodoro'));
const Todo = lazy(() => import('./pages/tools/Todo'));
const PDFViewerWrapper = lazy(() => import('./components/common/PDFViewerWrapper'));
const Register = lazy(() => import('./pages/auth/Register'));
const Profile = lazy(() => import('./pages/profile'));
const ResourceRadar = lazy(() => import('./pages/resource-radar'));
const SubjectNotes = lazy(() => import('./components/notes/SubjectNotes'));

/**
 * HomePage Component
 * Landing page component that combines Hero, Features, and UsefulLinks
 * Kept as a separate component for better organization and maintainability
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
 * Main application wrapper that provides:
 * - Pomodoro context for time management features
 * - Consistent layout structure
 * - Route definitions
 * - Global notification system
 * 
 * Layout Structure:
 * - Navbar (fixed at top)
 * - Main content area (flexible height)
 * - Footer (fixed at bottom)
 * - Toast notifications (overlay)
 */
const AppContent: React.FC = () => {
  return (
    <PomodoroProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              {/* Public Routes - Accessible without authentication */}
              <Route path="/" element={<HomePage />} />
              
              {/* College Routes - College exploration and details */}
              <Route path="/colleges" element={<CollegePage />} />
              <Route path="/colleges/:id" element={<CollegeDetail />} />
              
              {/* Information Pages - Static content */}
              <Route path="/career" element={<Career />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Tool Routes - Interactive features */}
              <Route path="/tools/gpa-calculator" element={<GPACalculator />} />
              <Route path="/tools/pomodoro" element={<Pomodoro />} />
              <Route path="/tools/todo" element={<Todo />} />
              
              {/* Study Material Routes - Academic resources */}
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/:id" element={<Notes />} />
              <Route path="/notes/subject/:subjectId/:subjectName" element={<SubjectNotes />} />
              <Route path="/viewer/:pdfUrl/:subject" element={<PDFViewerWrapper />} />
              <Route path="/question-papers" element={<QuestionPapers />} />
              <Route path="/question-papers/:subjectId/:subjectName/papers" element={<QuestionPapersPapers />} />
              <Route path="/resource-radar" element={<ResourceRadar />} />
              
              {/* Syllabus Routes - Course structure and content */}
              <Route path="/syllabus" element={<SyllabusList />} />
              <Route path="/syllabus/subject/:subjectId/:subjectName" element={<SubjectSyllabusList />} />
              
              {/* Authentication Routes - User management */}
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
        
        {/* Global Toast Container for notifications */}
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
 * Top-level component that provides:
 * - Router for navigation
 * - Authentication context
 * - Global error boundary (implicit)
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
