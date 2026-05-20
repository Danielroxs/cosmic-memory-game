const HS_KEY = 'cosmicMemory_highScore';

export function calcMatchPoints(combo) {
  return Math.round(100 * (1 + combo * 0.5));
}

export function calcTimeBonus(secondsLeft) {
  return secondsLeft * 12;
}

export function getHighScore() {
  return parseInt(localStorage.getItem(HS_KEY) || '0', 10);
}

export function saveHighScore(score) {
  const prev = getHighScore();
  if (score > prev) {
    localStorage.setItem(HS_KEY, String(score));
    return true;
  }
  return false;
}