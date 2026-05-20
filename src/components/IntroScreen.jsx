import { useEffect, useState } from 'react'
import StarField from './StarField'

export default function IntroScreen({ onStart }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center gap-8 overflow-hidden"
      style={{ background: '#050510' }}
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
        <div className="flex items-center justify-center gap-2 mb-5 select-none flex-wrap">
          {['/cards/star.webp', '/cards/moon.webp', '/cards/sun.webp', '/cards/comet.webp'].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{
                width: 'clamp(60px, 18vw, 110px)',
                height: 'clamp(60px, 18vw, 110px)',
                imageRendering: 'pixelated',
                animation: `starTwinkle 2.2s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>

        <h1
          className="font-display font-black tracking-widest uppercase mb-1"
          style={{
            fontSize: 'clamp(2rem, 12vw, 4.5rem)',
            background: 'linear-gradient(135deg, #00d4ff 0%, #ffffff 35%, #7c4dff 65%, #00d4ff 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s linear infinite',
          }}
        >
          Cosmic
        </h1>

        <h2
          className="font-display font-bold uppercase"
          style={{
            fontSize: 'clamp(0.7rem, 3vw, 1.4rem)',
            color: '#556677',
            letterSpacing: '0.55em',
          }}
        >
          Memory Game
        </h2>

        <div className="flex items-center justify-center gap-3 mt-4">
          <div style={{ width: '55px', height: '1px', background: 'linear-gradient(90deg, transparent, #00d4ff44)' }} />
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00d4ff44' }} />
          <div style={{ width: '55px', height: '1px', background: 'linear-gradient(90deg, #00d4ff44, transparent)' }} />
        </div>
      </div>

      {/* Start button — slides in from the bottom */}
      <div
        className="relative z-10"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'translateY(0)' : 'translateY(120px)',
          transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s',
        }}
      >
        <button className="btn-primary" onClick={onStart}>
          Start Game
        </button>
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
      `}</style>
    </div>
  )
}