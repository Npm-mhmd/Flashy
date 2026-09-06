# Flashy

A sketchy-designed flashcard app built with React. Study smarter using spaced repetition — cards you struggle with come back sooner, cards you know well are pushed further out.

## Features

- **Deck management** — create, rename, and delete decks
- **Card creation** — add cards to any deck with a live flip preview as you type
- **Spaced repetition** — rate each card as Again / Hard / Good / Easy after each review
- **Study sessions** — cards are queued by due date; the session is frozen on start so rating a card mid-session never breaks the queue
- **Session summary** — a completion modal shows your rating breakdown when you finish
- **Keyboard shortcuts** — `Space` to flip, `1–4` to rate
- **Persistent storage** — all decks and cards are saved to `localStorage`
- **Sketchy design** — hand-drawn aesthetic using Caveat and Caveat Brush fonts with offset shadows and ruled-paper background

## Tech Stack

- React 19
- React Router v7
- Vite
- CSS custom properties (no UI library)

## Getting Started

```bash
cd flashy
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Project Structure

```
src/
├── components/
│   ├── FlashCard.jsx       # Flip card component (controlled)
│   └── FlashCard.css
├── context/
│   └── DeckContext.jsx     # Global state + localStorage persistence
├── pages/
│   ├── dashboard.jsx       # Deck overview with stats
│   ├── Dashboard.css
│   ├── NewDeck.jsx         # Create deck + manage existing decks
│   ├── CreateDeck.jsx      # Add cards to a deck with live preview
│   ├── CreateDeck.css
│   ├── StudySession.jsx    # Study flow with spaced repetition
│   └── StudySession.css
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Spaced Repetition Intervals

| Rating | Next review |
|--------|-------------|
| Again  | re-queued immediately in the same session |
| Hard   | 1 minute |
| Good   | 10 minutes |
| Easy   | 4 days |
