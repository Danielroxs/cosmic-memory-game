import { useState } from 'react'
import Card from './Card'
import { createDeck } from '../utils/cardData'

function MuteIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  )
}

function SoundIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  )
}

export default function GameScreen() {
  const [cards, setCards] = useState(() => createDeck())
  const [flipped, setFlipped] = useState([])
  const [locked, setLocked] = useState(false)
  const [muted, setMuted] = useState(false)

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
      {/* Mute button top right */}
      <button
        onClick={() => setMuted(m => !m)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        style={{ color: muted ? '#2a3a4a' : '#00d4ff' }}
      >
        {muted ? <MuteIcon /> : <SoundIcon />}
      </button>

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