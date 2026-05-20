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

export function calcStars(secondsLeft, totalTime) {
  const pct = secondsLeft / totalTime;
  if (pct >= 0.5) return 3;
  if (pct >= 0.25) return 2;
  return 1;
}