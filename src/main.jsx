import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { DeckProvider } from './context/DeckContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DeckProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DeckProvider>
  </React.StrictMode>,
);