import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDecks } from '../context/DeckContext';
import './CreateDeck.css';

export default function CreateDeck() {
  const [frontText, setFrontText]       = useState('');
  const [backText, setBackText]         = useState('');
  const [added, setAdded]               = useState(0);
  const [previewFlipped, setPreviewFlipped] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { addCard, decks } = useDecks();

  const deckId = parseInt(searchParams.get('deckId'));
  const deck   = decks.find(d => d.id === deckId);

  if (!deck) return (
    <div className="create-container">
      <p className="no-deck-msg">
        No deck selected.{' '}
        <button className="link-btn" onClick={() => navigate('/new-deck')}>Pick or create one</button>
      </p>
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    addCard(deck.id, { id: Date.now(), front: frontText, back: backText, nextReview: new Date().toISOString() });
    setFrontText('');
    setBackText('');
    setPreviewFlipped(false);
    setAdded(n => n + 1);
  };

  const hasPreview = frontText.trim() || backText.trim();

  return (
    <div className="create-container">
      <div className="create-header">
        <h1 className="create-title">Add Cards</h1>
        <p className="deck-label">
          <span className="deck-label-arrow">in</span>
          <strong>{deck.title}</strong>
          <span className="deck-card-count">{deck.cards.length} cards</span>
        </p>
      </div>

      {added > 0 && (
        <div className="added-toast">{added} card{added !== 1 ? 's' : ''} added</div>
      )}

      <div className="create-layout">
        <form className="create-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="front">Front — Question</label>
            <textarea
              id="front"
              value={frontText}
              onChange={e => { setFrontText(e.target.value); setPreviewFlipped(false); }}
              placeholder="e.g. What is the time complexity of binary search?"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="back">Back — Answer</label>
            <textarea
              id="back"
              value={backText}
              onChange={e => setBackText(e.target.value)}
              placeholder="O(log n)"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Add Card</button>
            <button type="button" className="done-btn" onClick={() => navigate('/')}>Done</button>
          </div>
        </form>

        {hasPreview && (
          <div className="preview-panel">
            <p className="preview-label">Preview <span className="preview-hint">tap to flip</span></p>
            <div className={`mini-card ${previewFlipped ? 'flipped' : ''}`} onClick={() => setPreviewFlipped(f => !f)}>
              <div className="mini-card-inner">
                <div className="mini-face mini-front">
                  <span className="face-label-mini">Q</span>
                  <p>{frontText || '...'}</p>
                </div>
                <div className="mini-face mini-back">
                  <span className="face-label-mini answer">A</span>
                  <p>{backText || '...'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
