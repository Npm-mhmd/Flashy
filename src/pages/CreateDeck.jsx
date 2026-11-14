import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDecks } from '../context/useDecks';
import { parseDelimitedCards } from '../parseDelimitedCards';
import './CreateDeck.css';

const SEPARATORS = {
  comma: ',',
  semicolon: ';',
  tab: '\t',
  pipe: '|',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function CreateDeck() {
  const [frontText, setFrontText]       = useState('');
  const [backText, setBackText]         = useState('');
  const [added, setAdded]               = useState(0);
  const [previewFlipped, setPreviewFlipped] = useState(false);
  const [entryMode, setEntryMode] = useState('manual');
  const [separatorChoice, setSeparatorChoice] = useState('comma');
  const [customSeparator, setCustomSeparator] = useState('');
  const [skipHeader, setSkipHeader] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [importPreview, setImportPreview] = useState(null);
  const [importError, setImportError] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { addCard, addCards, decks } = useDecks();

  const deckId = searchParams.get('deckId');
  const deck   = decks.find(d => String(d.id) === deckId);

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
    const front = frontText.trim();
    const back = backText.trim();
    if (!front || !back) return;

    addCard(deck.id, { front, back, nextReview: new Date().toISOString() });
    setFrontText('');
    setBackText('');
    setPreviewFlipped(false);
    setAdded(n => n + 1);
  };

  const resetImportPreview = () => {
    setImportPreview(null);
    setImportError('');
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0] || null);
    resetImportPreview();
  };

  const handlePreviewImport = async (event) => {
    event.preventDefault();
    resetImportPreview();

    if (!selectedFile) {
      setImportError('Choose a CSV or text file first.');
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setImportError('The file is too large. Choose a file smaller than 5 MB.');
      return;
    }

    const delimiter = separatorChoice === 'custom' ? customSeparator : SEPARATORS[separatorChoice];
    setIsReadingFile(true);

    try {
      const text = await selectedFile.text();
      const result = parseDelimitedCards(text, delimiter, skipHeader);

      if (result.cards.length === 0) {
        setImportError('No complete cards were found. Check the separator and file contents.');
        return;
      }

      setImportPreview({ ...result, fileName: selectedFile.name });
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'The file could not be read.');
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleImport = () => {
    if (!importPreview) return;

    const nextReview = new Date().toISOString();
    addCards(deck.id, importPreview.cards.map(card => ({ ...card, nextReview })));
    setAdded(count => count + importPreview.cards.length);
    setSelectedFile(null);
    setImportPreview(null);
    setImportError('');
    setFileInputKey(key => key + 1);
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
        <div className="added-toast" role="status" aria-live="polite">{added} card{added !== 1 ? 's' : ''} added</div>
      )}

      <div className="entry-mode-switch" aria-label="Card entry method">
        <button
          type="button"
          className={entryMode === 'manual' ? 'active' : ''}
          onClick={() => setEntryMode('manual')}
          aria-pressed={entryMode === 'manual'}
        >
          Write Manually
        </button>
        <button
          type="button"
          className={entryMode === 'import' ? 'active' : ''}
          onClick={() => setEntryMode('import')}
          aria-pressed={entryMode === 'import'}
        >
          Import File
        </button>
      </div>

      {entryMode === 'manual' ? (
        <div className="create-layout">
          <form className="create-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="front">Front — Question</label>
              <textarea
                id="front"
                value={frontText}
                onChange={e => { setFrontText(e.target.value); setPreviewFlipped(false); }}
                placeholder="e.g. What is the time complexity of binary search?"
                maxLength={1000}
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
                maxLength={1000}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={!frontText.trim() || !backText.trim()}>Add Card</button>
              <button type="button" className="done-btn" onClick={() => navigate('/')}>Done</button>
            </div>
          </form>

          {hasPreview && (
            <div className="preview-panel">
              <p className="preview-label">Preview <span className="preview-hint">tap to flip</span></p>
              <button
                type="button"
                className={`mini-card ${previewFlipped ? 'flipped' : ''}`}
                onClick={() => setPreviewFlipped(f => !f)}
                aria-label={previewFlipped ? 'Show question preview' : 'Show answer preview'}
                aria-pressed={previewFlipped}
              >
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
              </button>
            </div>
          )}
        </div>
      ) : (
        <section className="import-panel" aria-labelledby="import-title">
          <div className="import-intro">
            <div>
              <h2 id="import-title">Import a card file</h2>
              <p>Each row becomes a card. Put the question first and the answer second.</p>
            </div>
            <span className="file-format-note">.csv or .txt · max 5 MB</span>
          </div>

          <form className="import-form" onSubmit={handlePreviewImport}>
            <div className="form-group file-input-group">
              <label htmlFor="card-file">Card file</label>
              <input
                key={fileInputKey}
                id="card-file"
                type="file"
                accept=".csv,.txt,text/csv,text/plain"
                onChange={handleFileChange}
              />
              <span className="field-help">
                Example: <code>What is 2 + 2?,4</code>
              </span>
            </div>

            <div className="import-options">
              <div className="form-group">
                <label htmlFor="separator">Separator</label>
                <select
                  id="separator"
                  value={separatorChoice}
                  onChange={event => { setSeparatorChoice(event.target.value); resetImportPreview(); }}
                >
                  <option value="comma">Comma (,)</option>
                  <option value="semicolon">Semicolon (;)</option>
                  <option value="tab">Tab</option>
                  <option value="pipe">Pipe (|)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {separatorChoice === 'custom' && (
                <div className="form-group">
                  <label htmlFor="custom-separator">Custom separator</label>
                  <input
                    id="custom-separator"
                    type="text"
                    value={customSeparator}
                    onChange={event => { setCustomSeparator(event.target.value); resetImportPreview(); }}
                    placeholder="e.g. ::"
                    maxLength={10}
                    required
                  />
                </div>
              )}

              <label className="header-option">
                <input
                  type="checkbox"
                  checked={skipHeader}
                  onChange={event => { setSkipHeader(event.target.checked); resetImportPreview(); }}
                />
                First row is a header
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={isReadingFile}>
              {isReadingFile ? 'Reading File…' : 'Preview Import'}
            </button>
          </form>

          {importError && <p className="import-error" role="alert">{importError}</p>}

          {importPreview && (
            <div className="import-preview">
              <div className="import-preview-heading">
                <div>
                  <h3>{importPreview.cards.length} card{importPreview.cards.length !== 1 ? 's' : ''} ready</h3>
                  <p>Previewing the first {Math.min(importPreview.cards.length, 5)} from {importPreview.fileName}</p>
                </div>
                {importPreview.skipped > 0 && (
                  <span className="skipped-badge">{importPreview.skipped} incomplete row{importPreview.skipped !== 1 ? 's' : ''} skipped</span>
                )}
              </div>

              <div className="import-table-wrap">
                <table className="import-table">
                  <thead>
                    <tr><th>Question</th><th>Answer</th></tr>
                  </thead>
                  <tbody>
                    {importPreview.cards.slice(0, 5).map((card, index) => (
                      <tr key={`${card.front}-${index}`}>
                        <td>{card.front}</td>
                        <td>{card.back}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="form-actions">
                <button type="button" className="submit-btn" onClick={handleImport}>
                  Import {importPreview.cards.length} Card{importPreview.cards.length !== 1 ? 's' : ''}
                </button>
                <button type="button" className="done-btn" onClick={() => navigate('/')}>Cancel</button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
