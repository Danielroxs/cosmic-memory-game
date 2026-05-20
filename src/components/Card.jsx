import { QuestionIcon } from './Icons'

export default function Card({ card, onClick, disabled }) {
  const isVisible = card.isFlipped || card.isMatched

  return (
    <div
      className={`card-scene ${disabled ? 'disabled' : 'cursor-pointer'}`}
      onClick={() => !disabled && !card.isFlipped && !card.isMatched && onClick(card)}
    >
      <div className={`card-inner ${isVisible ? 'is-flipped' : ''}`}>
        <div className="card-face card-back">
          <QuestionIcon size={52} />
        </div>
        <div className="card-face card-front">
          <img
            src={card.image}
            alt={card.label}
            style={{ width: '80%', height: '80%', objectFit: 'contain', imageRendering: 'pixelated' }}
          />
        </div>
      </div>
    </div>
  )
}