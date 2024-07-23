"use client";

import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NicePayVerify } from './action'; // 서버 측 함수 가져오기

export default function PaySuccess() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();

  const duration = 1 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 200, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록 window 객체 사용
    const query = new URLSearchParams(window.location.search);
    const id = query.get("orderId");
    setOrderId(id);
  }, []);

  useEffect(() => {
    if (orderId) {
      handlePaymentVerification(orderId);
    }
  }, [orderId]);

  const handlePaymentVerification = async (orderId: string) => {
    try {
      const result = await NicePayVerify(orderId); // 서버 측 함수 호출

      if (result.status === 'paid') {
        console.log("결제 성공:", result);
        handleConfetti();
      } else {
        console.error("결제 실패:", result.message);
        router.push('/'); // 결제 실패 시 홈으로 리다이렉트
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
      router.push('/'); // 오류 발생 시 홈으로 리다이렉트
    }
  };

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
