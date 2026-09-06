import './FlashCard.css';

export default function FlashCard({ frontContent, backContent, isFlipped, onFlip }) {
  return (
    <div className="flashcard-container" onClick={onFlip}>
      <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>

        <div className="flashcard-face flashcard-front">
          <span className="face-label">Q</span>
          <p>{frontContent}</p>
          <span className="flip-hint">Space or tap to flip</span>
        </div>

        <div className="flashcard-face flashcard-back">
          <span className="face-label answer-label">A</span>
          <p>{backContent}</p>
        </div>

      </div>
    </div>
  );
}
