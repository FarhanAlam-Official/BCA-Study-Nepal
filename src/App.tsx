import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import QuestionPapers from './components/home/QuestionPapers';
// import Events from './components/home/Events';
import Notes from './pages/Notes';
import Colleges from './pages/Colleges';
import Career from './pages/Career';

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      {/* <Events />  */} {/*Later to be implemendted if necessary */}
      <QuestionPapers />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;