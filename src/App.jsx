import { Routes, Route, Link, NavLink } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import CreateDeck from './pages/CreateDeck';
import NewDeck from './pages/NewDeck';
import StudySession from './pages/StudySession';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      <nav className="navbar" aria-label="Main navigation">
        <Link to="/" className="nav-logo">Flashy</Link>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>Dashboard</NavLink>
          <NavLink to="/new-deck" className={({ isActive }) => `nav-link btn-primary${isActive ? ' active' : ''}`}>Decks</NavLink>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-deck" element={<NewDeck />} />
          <Route path="/create" element={<CreateDeck />} />
          <Route path="/study/:deckId" element={<StudySession />} />
          <Route path="*" element={(
            <div className="not-found">
              <p className="not-found-code">404</p>
              <h1>Page not found</h1>
              <p>This page may have moved or never existed.</p>
              <Link to="/" className="new-deck-btn">Back to Dashboard</Link>
            </div>
          )} />
        </Routes>
      </main>
    </div>
  );
}
