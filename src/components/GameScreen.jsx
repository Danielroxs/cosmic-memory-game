import { useState, useEffect } from 'react'
import Card from './Card'
import Modal from './Modal'
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

const TOTAL_TIME = 30

export default function GameScreen({ onWin, onLose }) {
  const [cards, setCards] = useState(() => createDeck())
  const [flipped, setFlipped] = useState([])
  const [locked, setLocked] = useState(false)
  const [muted, setMuted] = useState(false)
  const [modal, setModal] = useState(null)
  const [timer, setTimer] = useState(TOTAL_TIME)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (gameOver) return
    const id = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(id)
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [gameOver])

  useEffect(() => {
    if (gameOver) setTimeout(() => onLose(), 700)
  }, [gameOver])

  function handleCardClick(card) {
    if (locked || gameOver) return

    setCards(prev => prev.map(c => c.uid === card.uid ? { ...c, isFlipped: true } : c))
    const newFlipped = [...flipped, card.uid]
    setFlipped(newFlipped)

    if (newFlipped.length < 2) return

    setLocked(true)

    setTimeout(() => {
      setCards(prev => {
        const first = prev.find(c => c.uid === newFlipped[0])
        const isMatch = first && first.id === card.id

        if (isMatch) {
          setModal('match')
          setTimeout(() => {
            setModal(null)
            setFlipped([])
            setLocked(false)
          }, 1500)
          return prev.map(c => newFlipped.includes(c.uid) ? { ...c, isFlipped: false, isMatched: true } : c)
        } else {
          setModal('nomatch')
          setTimeout(() => {
            setModal(null)
            setCards(c => c.map(x => newFlipped.includes(x.uid) ? { ...x, isFlipped: false } : x))
            setFlipped([])
            setLocked(false)
          }, 1500)
          return prev
        }
      })
    }, 560)
  }

  const timerPct = (timer / TOTAL_TIME) * 100

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center"
      style={{ background: '#050510' }}
    >
      {/* Timer bar */}
      <div className="w-full px-4 mb-6" style={{ maxWidth: '520px' }}>
        <div className="w-full rounded-full mb-1" style={{ height: '5px', background: '#0f1f2f' }}>
          <div
            className="h-full rounded-full transition-[width] duration-[980ms] linear"
            style={{
              width: `${timerPct}%`,
              background: 'linear-gradient(90deg, #00d4ff, #7c4dff)',
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="font-display font-bold text-lg tabular-nums" style={{ color: '#00d4ff' }}>
            {String(timer).padStart(2, '0')}s
          </span>
          <button
            onClick={() => setMuted(m => !m)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: muted ? '#2a3a4a' : '#00d4ff' }}
          >
            {muted ? <MuteIcon /> : <SoundIcon />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3" style={{ maxWidth: '520px', width: '100%', padding: '0 1rem' }}>
        {cards.map(card => (
          <Card
            key={card.uid}
            card={card}
            onClick={handleCardClick}
            disabled={locked || gameOver || card.isMatched}
          />
        ))}
      </div>

      {modal && <Modal type={modal} />}
    </div>
  )
}