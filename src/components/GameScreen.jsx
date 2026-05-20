import { useState } from 'react'
import Card from './Card'
import { createDeck } from '../utils/cardData'

export default function GameScreen() {
  const [cards, setCards] = useState(() => createDeck())
  const [flipped, setFlipped] = useState([])
  const [locked, setLocked] = useState(false)

  function handleCardClick(card) {
    if (locked) return

    setCards(prev => prev.map(c => c.uid === card.uid ? { ...c, isFlipped: true } : c))
    setFlipped(prev => [...prev, card.uid])
  }

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{ background: '#050510' }}
    >
      <div className="grid grid-cols-4 gap-3" style={{ maxWidth: '520px', width: '100%', padding: '0 1rem' }}>
        {cards.map(card => (
          <Card
            key={card.uid}
            card={card}
            onClick={handleCardClick}
            disabled={locked || card.isMatched}
          />
        ))}
      </div>
    </div>
  )
}