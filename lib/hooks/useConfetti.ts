// confettiUtil.ts
import confetti from "canvas-confetti";

const duration = 1 * 1000;
const animationEnd = Date.now() + duration;
const defaults = { startVelocity: 30, spread: 360, ticks: 200, zIndex: 0 };

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function triggerConfetti() {
  const intervalId = setInterval(() => {
    let timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      return;
    }

    const particleCount = 100 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.35, 0.6), y: Math.random() - 0.2 },
    });
  }, 250);
}
