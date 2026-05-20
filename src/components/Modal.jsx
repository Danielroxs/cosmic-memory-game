export default function Modal({ type }) {
  const isMatch = type === 'match'
  const color   = isMatch ? '#00ff88' : '#ff4422'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,16,0.75)', backdropFilter: 'blur(2px)' }} />

      <div
        className="relative z-10 text-center"
        style={{
          animation: 'modal-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
          minWidth: '300px',
          padding: '36px 48px',
          borderRadius: '16px',
          background: isMatch
            ? 'linear-gradient(145deg, #051a0e 0%, #030d08 100%)'
            : 'linear-gradient(145deg, #1a0505 0%, #0d0303 100%)',
          border: `2px solid ${color}`,
          boxShadow: `0 0 24px ${color}55, 0 0 60px ${color}22, inset 0 0 20px ${color}0d`,
        }}
      >
        {/* Corner accents */}
        {[
          { pos: 'top-0 left-0',     t: true,  b: false, l: true,  r: false },
          { pos: 'top-0 right-0',    t: true,  b: false, l: false, r: true  },
          { pos: 'bottom-0 left-0',  t: false, b: true,  l: true,  r: false },
          { pos: 'bottom-0 right-0', t: false, b: true,  l: false, r: true  },
        ].map(({ pos, t, b, l, r }, i) => (
          <div key={i} className={`absolute ${pos} w-3 h-3`} style={{
            borderTop:    t ? `2px solid ${color}` : 'none',
            borderBottom: b ? `2px solid ${color}` : 'none',
            borderLeft:   l ? `2px solid ${color}` : 'none',
            borderRight:  r ? `2px solid ${color}` : 'none',
          }} />
        ))}

        {/* Icon */}
        <div style={{
          fontSize: '52px',
          lineHeight: 1,
          marginBottom: '12px',
          color,
          textShadow: `0 0 16px ${color}`,
        }}>
          {isMatch ? '✦' : '✕'}
        </div>

        {/* Title */}
        <p className="font-display font-black uppercase" style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
          color,
          textShadow: `0 0 12px ${color}99`,
          marginBottom: isMatch ? 0 : '6px',
          letterSpacing: '0.15em',
        }}>
          {isMatch ? "nice! it's a match" : 'sorry,'}
        </p>

        {!isMatch && (
          <p className="font-display" style={{
            fontSize: 'clamp(0.75rem, 2vw, 0.95rem)',
            color: '#ff553366',
            letterSpacing: '0.08em',
          }}>
            this is not a match
          </p>
        )}

        {/* Scan line */}
        <div style={{
          marginTop: '16px',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${color}55, transparent)`,
        }} />
      </div>

      <style>{`
        @keyframes modal-pop {
          0%   { opacity: 0; transform: scale(0.6) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
