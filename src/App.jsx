import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import CreateDeck from './pages/CreateDeck';
import NewDeck from './pages/NewDeck';
import StudySession from './pages/StudySession';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="nav-logo">Flashy</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link btn-primary">Dashboard</Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-deck" element={<NewDeck />} />
          <Route path="/create" element={<CreateDeck />} />
          <Route path="/study/:deckId" element={<StudySession />} />
        </Routes>
      </main>
    </div>
  );
}
