import { createContext, useContext } from 'react';

export const DeckContext = createContext(null);

export function useDecks() {
  const context = useContext(DeckContext);

  if (!context) {
    throw new Error('useDecks must be used within a DeckProvider');
  }

  return context;
}
