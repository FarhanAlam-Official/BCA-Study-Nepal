import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import QuestionPapers from './components/home/QuestionPapers';
// import Events from './components/home/Events';
import UsefulLinks from './components/home/UsefulLinks';
import Notes from './pages/Notes';
import Colleges from './pages/Colleges';
import Career from './pages/Career';
import Contact from './pages/Contact';
import NotesList from './components/notes/NotesList';
// import PDFViewer from './components/notes/PDFViewer';
import CollegeDetail from './colleges/CollegeDetail';
import QuestionPaperList from './components/question-papers/QuestionPaperList';
import Syllabus from './pages/Syllabus';
import GPACalculator from './components/tools/GPACalculator';
import SubjectPapersPage from './components/question-papers/QuestionPapersPage';
import PDFViewerWrapper from './components/common/PDFViewerWrapper';


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
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
