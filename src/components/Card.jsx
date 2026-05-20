import { QuestionIcon } from './Icons'

export default function Card({ card }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{
        background: '#0a1628',
        border: '2px solid #1a3a6a',
        aspectRatio: '1',
        width: '100%',
      }}
    >
      <QuestionIcon size={52} />
    </div>
  )
}