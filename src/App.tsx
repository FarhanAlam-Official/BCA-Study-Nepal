import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import QuestionPapers from './components/home/QuestionPapers';
// import Events from './components/home/Events';
import UsefulLinks from './components/home/UsefulLinks';
import LoadingPage from './components/common/LoadingPage';

// Lazy load components
const Notes = lazy(() => import('./pages/Notes'));
const Colleges = lazy(() => import('./pages/Colleges'));
const Career = lazy(() => import('./pages/Career'));
const Contact = lazy(() => import('./pages/Contact'));
const NotesList = lazy(() => import('./components/notes/NotesList'));
// import PDFViewer from './components/notes/PDFViewer';
const CollegeDetail = lazy(() => import('./colleges/CollegeDetail'));
const QuestionPaperList = lazy(() => import('./components/question-papers/QuestionPaperList'));
const Syllabus = lazy(() => import('./pages/Syllabus'));
const GPACalculator = lazy(() => import('./components/tools/GPACalculator'));
const SubjectPapersPage = lazy(() => import('./components/question-papers/QuestionPapersPage'));
const PDFViewerWrapper = lazy(() => import('./components/common/PDFViewerWrapper'));

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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/career" element={<Career />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/" element={<NotesList />} />
              <Route path="/viewer/:pdfUrl/:subject" element={<PDFViewerWrapper />} />
              <Route path="/colleges/:id" element={<CollegeDetail />} />
              <Route path="question-papers" element={<QuestionPaperList />} />
              <Route path="/syllabus" element={<Syllabus />} />
              <Route path="/tools/gpa-calculator" element={<GPACalculator />} />
              <Route 
                path="/subjects/:subjectId/:subjectName/papers" 
                element={<SubjectPapersPage />} 
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
