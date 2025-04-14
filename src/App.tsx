import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Settings from './pages/Settings';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import QuestionPapers from './components/home/QuestionPapers';
import UsefulLinks from './components/home/UsefulLinks';
import LoadingPage from './components/common/LoadingPage';
import { PomodoroProvider } from './context/PomodoroContext';
import { AuthProvider } from './context/AuthContext';

// Lazy load components
const Notes = lazy(() => import('./pages/Notes'));
const Colleges = lazy(() => import('./pages/Colleges'));
const Career = lazy(() => import('./pages/Career'));
const Contact = lazy(() => import('./pages/Contact'));
// import PDFViewer from './components/notes/PDFViewer';
const CollegeDetail = lazy(() => import('./colleges/CollegeDetail'));
const QuestionPaperList = lazy(() => import('./components/question-papers/QuestionPaperList'));
const Syllabus = lazy(() => import('./pages/Syllabus'));
const GPACalculator = lazy(() => import('./components/tools/GPACalculator'));
const Pomodoro = lazy(() => import('./pages/tools/Pomodoro'));
const Todo = lazy(() => import('./pages/tools/Todo'));
// const MyNotes = lazy(() => import('./pages/tools/MyNotes'));
const SubjectPapersPage = lazy(() => import('./components/question-papers/QuestionPapersPage'));
const PDFViewerWrapper = lazy(() => import('./components/common/PDFViewerWrapper'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Profile = lazy(() => import('./pages/Profile'));

// Loading fallback component is now replaced with the existing LoadingPage component

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      {/* <Events />  */} {/*Later to be implemendted if necessary */}
      <QuestionPapers />
      <UsefulLinks />
    </>
  );
}

function AppContent() {
  return (
    <PomodoroProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/career" element={<Career />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/colleges/:id" element={<CollegeDetail />} />
              <Route path="/syllabus" element={<Syllabus />} />
              <Route path="/tools/gpa-calculator" element={<GPACalculator />} />
              <Route path="/tools/pomodoro" element={<Pomodoro />} />
              <Route path="/tools/todo" element={<Todo />} />
              {/* <Route path="/tools/my-notes" element={<MyNotes />} /> */}
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/:id" element={<Notes />} />
              <Route path="/viewer/:pdfUrl/:subject" element={<PDFViewerWrapper />} />
              <Route path="/question-papers" element={<QuestionPaperList />} />
              <Route path="/question-papers/:subjectId/:subjectName/papers" element={<SubjectPapersPage />} />
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
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </PomodoroProvider>
  );
}

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
