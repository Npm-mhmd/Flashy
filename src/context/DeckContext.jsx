import { createContext, useState, useEffect, useContext } from 'react';

const DeckContext = createContext();

export function DeckProvider({ children }) {
  const [decks, setDecks] = useState(() => {
    const saved = localStorage.getItem('flashcard-decks');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        title: 'Bac Informatique Prep',
        cards: [
          { id: 101, front: 'Write a Python function to check if a string is a palindrome.', back: 'def is_palindrome(s):\n    return s == s[::-1]', nextReview: new Date().toISOString() },
          { id: 102, front: 'How do you declare an array of 10 integers in C++?', back: 'int myArray[10];', nextReview: new Date().toISOString() },
        ],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('flashcard-decks', JSON.stringify(decks));
  }, [decks]);

  const addDeck = (title) => {
    const newDeck = { id: Date.now(), title, cards: [] };
    setDecks(prev => [...prev, newDeck]);
    return newDeck.id;
  };

  const renameDeck = (deckId, title) =>
    setDecks(prev => prev.map(d => d.id === deckId ? { ...d, title } : d));

  const deleteDeck = (deckId) =>
    setDecks(prev => prev.filter(d => d.id !== deckId));

  const addCard = (deckId, card) =>
    setDecks(prev => prev.map(d => d.id === deckId ? { ...d, cards: [...d.cards, card] } : d));

  const updateCard = (deckId, updated) =>
    setDecks(prev => prev.map(d =>
      d.id === deckId ? { ...d, cards: d.cards.map(c => c.id === updated.id ? updated : c) } : d
    ));

  const deleteCard = (deckId, cardId) =>
    setDecks(prev => prev.map(d =>
      d.id === deckId ? { ...d, cards: d.cards.filter(c => c.id !== cardId) } : d
    ));

  return (
    <DeckContext.Provider value={{ decks, addDeck, renameDeck, deleteDeck, addCard, updateCard, deleteCard }}>
      {children}
    </DeckContext.Provider>
  );
}

export const useDecks = () => useContext(DeckContext);
