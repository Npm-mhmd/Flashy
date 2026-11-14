import { useEffect, useState } from 'react';
import { DeckContext } from './useDecks';

const STORAGE_KEY = 'flashcard-decks';

const createId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const sameId = (left, right) => String(left) === String(right);

function loadDecks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(deck => deck && typeof deck === 'object')
      .map(deck => ({
        ...deck,
        id: deck.id ?? createId(),
        title: String(deck.title || 'Untitled deck'),
        cards: Array.isArray(deck.cards)
          ? deck.cards
              .filter(card => card && typeof card === 'object')
              .map(card => ({
                ...card,
                id: card.id ?? createId(),
                front: String(card.front || ''),
                back: String(card.back || ''),
                nextReview: Number.isNaN(new Date(card.nextReview).getTime())
                  ? new Date().toISOString()
                  : card.nextReview,
              }))
          : [],
      }));
  } catch {
    return [];
  }
}

export function DeckProvider({ children }) {
  const [decks, setDecks] = useState(loadDecks);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    } catch {
      // The app remains usable when storage is unavailable or full.
    }
  }, [decks]);

  const addDeck = (title) => {
    const newDeck = { id: createId(), title, cards: [] };
    setDecks(prev => [...prev, newDeck]);
    return newDeck.id;
  };

  const renameDeck = (deckId, title) =>
    setDecks(prev => prev.map(d => sameId(d.id, deckId) ? { ...d, title } : d));

  const deleteDeck = (deckId) =>
    setDecks(prev => prev.filter(d => !sameId(d.id, deckId)));

  const addCards = (deckId, cards) =>
    setDecks(prev => prev.map(d => sameId(d.id, deckId)
      ? {
          ...d,
          cards: [
            ...d.cards,
            ...cards.map(card => ({ ...card, id: createId() })),
          ],
        }
      : d));

  const addCard = (deckId, card) => addCards(deckId, [card]);

  const updateCard = (deckId, updated) =>
    setDecks(prev => prev.map(d =>
      sameId(d.id, deckId)
        ? { ...d, cards: d.cards.map(c => sameId(c.id, updated.id) ? updated : c) }
        : d
    ));

  const deleteCard = (deckId, cardId) =>
    setDecks(prev => prev.map(d =>
      sameId(d.id, deckId)
        ? { ...d, cards: d.cards.filter(c => !sameId(c.id, cardId)) }
        : d
    ));

  return (
    <DeckContext.Provider value={{ decks, addDeck, renameDeck, deleteDeck, addCard, addCards, updateCard, deleteCard }}>
      {children}
    </DeckContext.Provider>
  );
}
