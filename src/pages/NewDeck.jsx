import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDecks } from '../context/DeckContext';
import './CreateDeck.css';

export default function NewDeck() {
  const [title, setTitle]         = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState('');
  const { addDeck, deleteDeck, renameDeck, decks } = useDecks();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newId = addDeck(title.trim());
    navigate(`/create?deckId=${newId}`);
  };

  const startRename  = (deck) => { setRenamingId(deck.id); setRenameVal(deck.title); };
  const commitRename = (id)   => { if (renameVal.trim()) renameDeck(id, renameVal.trim()); setRenamingId(null); };

  const handleDelete = (deck) => {
    if (window.confirm(`Delete "${deck.title}" and all its cards? This cannot be undone.`))
      deleteDeck(deck.id);
  };

  return (
    <div className="create-container">
      <h1 className="create-title">New Deck</h1>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deck-title">Deck Name</label>
          <input
            id="deck-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Biology Chapter 3, French Vocab..."
            required
            autoFocus
          />
        </div>
        <button type="submit" className="submit-btn">Create Deck</button>
      </form>

      {decks.length > 0 && (
        <div className="existing-decks">
          <h2 className="existing-title">Your Decks</h2>
          <ul className="deck-list">
            {decks.map(deck => (
              <li key={deck.id} className="deck-list-item">
                {renamingId === deck.id ? (
                  <input
                    className="rename-input"
                    value={renameVal}
                    onChange={e => setRenameVal(e.target.value)}
                    onBlur={() => commitRename(deck.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter')  commitRename(deck.id);
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="deck-list-name" onDoubleClick={() => startRename(deck)} title="Double-click to rename">
                    {deck.title}
                  </span>
                )}
                <div className="deck-list-actions">
                  <span className="deck-list-count">{deck.cards.length} cards</span>
                  <button className="btn-rename"  onClick={() => startRename(deck)}>Rename</button>
                  <button className="btn-add-to"  onClick={() => navigate(`/create?deckId=${deck.id}`)}>Add Cards</button>
                  <button className="btn-delete"  onClick={() => handleDelete(deck)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
