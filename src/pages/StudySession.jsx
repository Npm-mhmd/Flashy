import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDecks } from '../context/DeckContext';
import FlashCard from '../components/FlashCard';
import './StudySession.css';

export default function StudySession() {
  const { deckId } = useParams();
  const navigate   = useNavigate();
  const { decks, updateCard } = useDecks();

  const deck = decks.find(d => d.id === parseInt(deckId));

  const queueRef = useRef(null);
  if (queueRef.current === null && deck) {
    const now = new Date();
    queueRef.current = deck.cards.filter(c => new Date(c.nextReview) <= now);
  }

  const [queue, setQueue]               = useState(() => queueRef.current || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped]       = useState(false);
  const [done, setDone]                 = useState(false);
  const [ratings, setRatings]           = useState({ hard: 0, good: 0, easy: 0 });

  const activeCard = queue[currentIndex];

  const advance = useCallback((newQueue) => {
    const q    = newQueue ?? queue;
    const next = currentIndex + 1;
    if (next >= q.length) setDone(true);
    else { setCurrentIndex(next); setIsFlipped(false); }
  }, [currentIndex, queue]);

  const handleFeedback = useCallback((difficulty) => {
    if (!activeCard) return;
    const d = new Date();
    if (difficulty === 'hard') d.setMinutes(d.getMinutes() + 1);
    if (difficulty === 'good') d.setMinutes(d.getMinutes() + 10);
    if (difficulty === 'easy') d.setDate(d.getDate() + 4);
    updateCard(deck.id, { ...activeCard, nextReview: d.toISOString() });
    setRatings(r => ({ ...r, [difficulty]: r[difficulty] + 1 }));
    advance();
  }, [activeCard, deck, updateCard, advance]);

  const handleAgain = useCallback(() => {
    const newQueue = [...queue, activeCard];
    setQueue(newQueue);
    advance(newQueue);
  }, [queue, activeCard, advance]);

  const handleFlip = useCallback(() => setIsFlipped(f => !f), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); handleFlip(); }
      if (!isFlipped) return;
      if (e.key === '1') handleAgain();
      if (e.key === '2') handleFeedback('hard');
      if (e.key === '3') handleFeedback('good');
      if (e.key === '4') handleFeedback('easy');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFlipped, handleFlip, handleAgain, handleFeedback]);

  if (!deck) return <p className="state-msg">Deck not found.</p>;

  if (queue.length === 0) return (
    <div className="study-complete-wrap">
      <div className="completion-modal">
        <p className="completion-icon">—</p>
        <h2>Nothing due</h2>
        <p>All cards in <em>{deck.title}</em> are up to date.</p>
        <button className="btn-dashboard" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    </div>
  );

  const progress   = (currentIndex / queue.length) * 100;
  const totalRated = ratings.hard + ratings.good + ratings.easy;

  return (
    <div className="study-container">
      {done && (
        <div className="completion-overlay">
          <div className="completion-modal">
            <h2>Session Complete</h2>
            <p>You reviewed <strong>{totalRated}</strong> card{totalRated !== 1 ? 's' : ''} in <em>{deck.title}</em>.</p>
            {totalRated > 0 && (
              <div className="rating-summary">
                <span className="rs-again">Again {queue.length - totalRated}</span>
                <span className="rs-hard">Hard {ratings.hard}</span>
                <span className="rs-good">Good {ratings.good}</span>
                <span className="rs-easy">Easy {ratings.easy}</span>
              </div>
            )}
            <button className="btn-dashboard" onClick={() => navigate('/')}>Back to Dashboard</button>
          </div>
        </div>
      )}

      <div className="study-header">
        <h2>{deck.title}</h2>
        <p className="card-count">{queue.length - currentIndex} / {queue.length} remaining</p>
      </div>

      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="flashcard-wrapper">
        <FlashCard
          key={`${activeCard?.id}-${currentIndex}`}
          frontContent={activeCard?.front}
          backContent={activeCard?.back}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>

      <div className="feedback-controls">
        {!isFlipped ? (
          <p className="flip-prompt">Tap card or press Space to reveal</p>
        ) : (
          <>
            <p>How well did you know this?</p>
            <div className="button-group">
              <button className="btn-again" onClick={handleAgain}><span className="kbd">1</span>Again</button>
              <button className="btn-hard"  onClick={() => handleFeedback('hard')}><span className="kbd">2</span>Hard</button>
              <button className="btn-good"  onClick={() => handleFeedback('good')}><span className="kbd">3</span>Good</button>
              <button className="btn-easy"  onClick={() => handleFeedback('easy')}><span className="kbd">4</span>Easy</button>
            </div>
          </>
        )}
      </div>

      <p className="shortcut-hint">Space = flip · 1–4 = rate</p>
    </div>
  );
}
