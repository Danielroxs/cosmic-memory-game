export const CARD_TYPES = [
  { id: 'star',  label: 'Star',  color: '#FFD700', border: '#FFD70055', image: '/cards/star.webp' },
  { id: 'moon',  label: 'Moon',  color: '#90A8D8', border: '#90A8D855', image: '/cards/moon.webp' },
  { id: 'sun',   label: 'Sun',   color: '#FF8C00', border: '#FF8C0055', image: '/cards/sun.webp' },
  { id: 'comet', label: 'Comet', color: '#00D4FF', border: '#00D4FF55', image: '/cards/comet.webp' },
]

export function createDeck() {
  const deck = [...CARD_TYPES, ...CARD_TYPES].map((type, i) => ({
    ...type,
    uid: `${type.id}-${i}`,
    isFlipped: false,
    isMatched: false,
  }))

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }

  return deck
}