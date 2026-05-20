export default function Modal({ type }) {
  const isMatch = type === 'match'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative z-10 px-10 py-8 rounded-2xl text-center"
        style={{
          background: isMatch ? 'linear-gradient(135deg, #0a2a1a, #061a10)' : 'linear-gradient(135deg, #2a0a0a, #1a0606)',
          border: `2px solid ${isMatch ? '#00ff8855' : '#ff444455'}`,
          minWidth: '280px',
        }}
      >
        <div className="text-5xl mb-3">{isMatch ? '✨' : '💫'}</div>
        <p className="font-display font-bold text-2xl mb-1" style={{ color: isMatch ? '#00ff88' : '#ff6666' }}>
          {isMatch ? 'Nice!' : 'Oh no!'}
        </p>
        <p className="font-body text-lg" style={{ color: isMatch ? '#aaffcc' : '#ffaaaa' }}>
          {isMatch ? "It's a match! 🎉" : "Sorry, but this is not a match."}
        </p>
      </div>
    </div>
  )
}