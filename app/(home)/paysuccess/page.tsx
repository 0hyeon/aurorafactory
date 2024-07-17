"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function PaySuccess() {
  const duration = 1 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 200, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    handleConfetti();
  }, []);
  const handleConfetti = () => {
    const intervalId: NodeJS.Timeout = setInterval(() => {
      let timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(intervalId);
      }

      var particleCount = 900 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.35, 0.6), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  };

  return (
    <div>
      <div className="text-center  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-6 flex flex-col">
        <div className="text-xl text-gray-400">구매가 완료되었습니다.</div>
        <span className="text-base text-gray-400">감사합니다!</span>
      </div>
    </div>
  );
}
