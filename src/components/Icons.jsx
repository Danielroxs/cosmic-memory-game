export function QuestionIcon({ size = 52, color = '#FFD700' }) {
  const glow  = color + '99'
  const glow2 = color + '33'
  const fill  = color + '0d'
  const ring  = color + '44'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="question-icon"
      style={{ '--icon-glow': glow, '--icon-glow2': glow2 }}
    >
      {/* Outer dashed ring — orbiting */}
      <circle cx="12" cy="12" r="10.5" stroke={color} strokeWidth="0.6" strokeDasharray="2.5 3.5" className="orbit-ring" />
      {/* Mid decorative ring */}
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="0.4" opacity="0.25" />
      {/* Inner glow fill */}
      <circle cx="12" cy="12" r="7.5" fill={fill} stroke={ring} strokeWidth="0.6" />
      {/* Question mark */}
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth="2.5" />
      <circle cx="12" cy="17" r=".65" fill={color} stroke="none" />
    </svg>
  )
}
