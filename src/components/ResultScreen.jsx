import { useEffect, useState } from 'react'

export default function ResultScreen({ won, onPlayAgain }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center gap-8"
      style={{ background: '#050510' }}
    >
      <div
        className="text-center transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-60px)',
        }}
      >
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
          {won ? '🏆' : '🌌'}
        </div>

        <h1
          className="font-display font-black uppercase tracking-widest"
          style={{
            fontSize: 'clamp(1.8rem, 6vw, 3rem)',
            color: won ? '#00ff88' : '#ff6666',
            textShadow: won ? '0 0 30px rgba(0,255,100,0.4)' : '0 0 30px rgba(255,60,60,0.4)',
          }}
        >
          {won ? 'You Did It!' : "Oops!"}
        </h1>

        <p
          className="font-body text-lg mt-2"
          style={{ color: won ? '#aaffcc' : '#ffaaaa' }}
        >
          {won
            ? 'You found all the matches!'
            : "You didn't find them all in time."}
        </p>
      </div>

      <div
        className="transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(80px)',
          transitionDelay: visible ? '200ms' : '0ms',
        }}
      >
        <button className="btn-primary" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  )
}