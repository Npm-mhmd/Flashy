import { Link } from 'react-router-dom';
import { useDecks } from '../context/DeckContext';
import './Dashboard.css';

export default function Dashboard() {
  const { decks } = useDecks();
  const now = new Date();

  const totalDue   = decks.reduce((s, d) => s + d.cards.filter(c => new Date(c.nextReview) <= now).length, 0);
  const totalCards = decks.reduce((s, d) => s + d.cards.length, 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Decks</h1>
        <Link to="/new-deck" className="new-deck-btn">New Deck</Link>
      </div>

      {totalCards > 0 && (
        <div className="summary-bar">
          <div className="summary-stat">
            <span className="summary-num">{decks.length}</span>
            <span className="summary-label">decks</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-stat">
            <span className="summary-num">{totalCards}</span>
            <span className="summary-label">cards</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-stat">
            <span className={`summary-num ${totalDue > 0 ? 'due-num' : ''}`}>{totalDue}</span>
            <span className="summary-label">due today</span>
          </div>
        </div>
      )}

      {decks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-heading">No decks yet</p>
          <p className="empty-sub">Create your first deck and start learning</p>
          <Link to="/new-deck" className="empty-cta">Create a Deck</Link>
        </div>
      ) : (
        <div className="deck-grid">
          {decks.map((deck, i) => {
            const dueCount      = deck.cards.filter(c => new Date(c.nextReview) <= now).length;
            const masteredCount = deck.cards.filter(c => (new Date(c.nextReview) - now) > 1000 * 60 * 60 * 24 * 3).length;
            return (
              <div key={deck.id} className={`deck-card ${i % 2 === 0 ? 'tilt-left' : 'tilt-right'}`}>
                <div className="deck-card-top">
                  <h2>{deck.title}</h2>
                  <span className="deck-total">{deck.cards.length} cards</span>
                </div>
                <div className="deck-card-stats">
                  <span className="stat-pill stat-mastered">{masteredCount} mastered</span>
                  <span className={`stat-pill ${dueCount > 0 ? 'stat-due' : 'stat-done'}`}>
                    {dueCount > 0 ? `${dueCount} due` : 'all done'}
                  </span>
                </div>
                <div className="deck-card-actions">
                  <Link to={`/create?deckId=${deck.id}`} className="deck-action-btn btn-outline">Add Cards</Link>
                  <Link to={`/study/${deck.id}`} className={`deck-action-btn ${dueCount > 0 ? 'btn-solid' : 'btn-muted'}`}>
                    {dueCount > 0 ? 'Study' : 'Review'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
