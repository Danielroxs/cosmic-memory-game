import { QuestionIcon } from './Icons'

const HINT_COLOR = '#FFDD00'

export default function Card({ card, onClick, disabled, isHint }) {
  const isVisible = card.isFlipped || card.isMatched

  return (
    <div
      className={`card-scene ${disabled ? 'disabled' : 'cursor-pointer'}`}
      onClick={() => !disabled && !card.isFlipped && !card.isMatched && onClick(card)}
    >
      <div className={`card-inner ${isVisible ? 'is-flipped' : ''}`}>
        <div
          className="card-face card-back"
          style={isHint ? {
            '--card-glow':   HINT_COLOR + '55',
            '--card-glow2':  HINT_COLOR + 'bb',
            '--card-border': HINT_COLOR + '99',
          } : undefined}
        >
          <QuestionIcon size={52} color={isHint ? HINT_COLOR : '#FFD700'} />
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
