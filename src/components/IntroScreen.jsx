import { useEffect, useState } from 'react'
import StarField from './StarField'
import { DIFFICULTIES } from '../utils/scoreUtils'

export default function IntroScreen({ onStart }) {
  const [visible, setVisible] = useState(false)
  const [diff, setDiff] = useState('normal')

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#050510', gap: 'clamp(1.5rem, 5vh, 3.5rem)' }}
    >
      <StarField />

      {/* Logo — slides in from the top */}
      <div
        className="relative z-10 text-center px-4"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'translateY(0)' : 'translateY(-120px)',
          transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div className="flex items-center justify-center select-none flex-wrap"
          style={{ gap: 'clamp(1rem, 4vw, 3rem)', marginBottom: 'clamp(1.5rem, 4vh, 3rem)' }}>
          {['/cards/star.webp', '/cards/moon.webp', '/cards/sun.webp', '/cards/comet.webp'].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{
                width: 'clamp(72px, 14vw, 140px)',
                height: 'clamp(72px, 14vw, 140px)',
                imageRendering: 'pixelated',
                animation: `starTwinkle 2.2s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>

        <div style={{ transform: 'translateY(20px)' }}>
          <div style={{ animation: 'float 3s ease-in-out infinite' }}>
            <img
              src="/images/logo.webp"
              alt="Cosmic Memory Game"
              style={{
                width:          'clamp(320px, 66vw, 650px)',
                maxWidth:       '90vw',
                imageRendering: 'pixelated',
                display:        'block',
                margin:         '-20% auto',
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ transform: 'translateY(-clamp(0.5rem, 2vh, 1.5rem))', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(1.5rem, 5vh, 3.5rem)' }}>

      {/* Difficulty selector — slides in with button */}
      <div
        className="relative z-10 flex flex-col items-center gap-3"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'translateY(0)' : 'translateY(120px)',
          transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s',
        }}
      >
        <p className="font-body text-xs tracking-[0.25em] uppercase" style={{ color: '#445566' }}>
          Select Difficulty
        </p>
        <div className="flex gap-2">
          {Object.entries(DIFFICULTIES).map(([key, d]) => {
            const active = diff === key
            return (
              <button
                key={key}
                onClick={() => setDiff(key)}
                className="btn-diff px-4 py-2 rounded-full font-display text-xs uppercase tracking-wider"
                style={{
                  border:     `1.5px solid ${active ? d.color : d.color + '33'}`,
                  color:       active ? d.color : '#556677',
                  background:  active ? `${d.color}18` : 'transparent',
                  boxShadow:   active ? `0 0 16px ${d.color}30` : 'none',
                  transform:   active ? 'scale(1.05)' : 'scale(1)',
                  fontSize:    'clamp(0.65rem, 1.5vw, 0.8rem)',
                }}
              >
                {d.label}
                <span className="ml-1 opacity-60" style={{ fontSize: '0.7em' }}>{d.description}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Start button — slides in from the bottom */}
      <div
        className="relative z-10"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'translateY(0)' : 'translateY(120px)',
          transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s',
        }}
      >
        <button
          className="btn-primary"
          onClick={() => onStart(diff)}
          style={{ borderColor: DIFFICULTIES[diff].color, boxShadow: `0 0 20px ${DIFFICULTIES[diff].color}40` }}
        >
          Start Game
        </button>
      </div>

      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%       { opacity: 0.3; transform: scale(0.8); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  )
}