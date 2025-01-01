import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import QuestionPapers from './components/home/QuestionPapers';
// import Events from './components/home/Events';
import UsefulLinks from './components/home/UsefulLinks';
// import Notes from './pages/Notes';
import Colleges from './pages/Colleges';
import Career from './pages/Career';
import Contact from './pages/Contact';
import NotesList from './components/notes/NotesList';
import NoteDetail from './components/notes/NoteDetail';

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
            <Route path="/notes" element={<NotesList />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/career" element={<Career />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
