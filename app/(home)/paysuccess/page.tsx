"use client";

import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NicePayVerify } from "./action";

export default function PaySuccess() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const router = useRouter();

  const duration = 1 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 200, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("orderId");
    const amt = query.get("amount");
    setOrderId(id);
    setAmount(Number(amt));
  }, []);

  useEffect(() => {
    if (orderId) {
      // handlePaymentVerification(orderId, amount);
      NicePayVerify(orderId, amount)
    }
  }, [orderId]);

  // const handlePaymentVerification = async (orderId: string, amount: number) => {
  //   try {
  //     const response = await fetch('/api/nicepay/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ orderId, amount }),
  //     });

  //     // if (!response.ok) {
  //     //   const errorText = await response.text();
  //     //   throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  //     // }

  //     const result = await response.json();
  //     if (result.status === 'paid') {
  //       console.log("결제 성공:", result);
  //       handleConfetti();
  //     } else {
  //       console.error("결제 실패:", result);
  //       // router.push('/');
  //     }
  //   } catch (error) {
  //     console.error("서버 요청 오류:", error);
  //     // router.push('/');
  //   }
  // };

  const handleConfetti = () => {
    const intervalId = setInterval(() => {
      let timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(intervalId);
        return;
      }

      var particleCount = 900 * (timeLeft / duration);
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
  };

  return (
    <div className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-6 flex flex-col">
      <div className="text-xl text-gray-400">구매가 완료되었습니다.</div>
      <span className="text-base text-gray-400">감사합니다!</span>
    </div>
  );
}
