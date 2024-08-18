"use client";

import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaySuccess() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPid, setPid] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [result, setResult] = useState<{
    status: string;
    message?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const duration = 1 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 200, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const handleConfetti = () => {
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
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("orderId");
    const amt = query.get("amount");
    const pid = query.get("tid");

    setOrderId(id);
    setAmount(Number(amt));
    setPid(pid);
  }, []);

  useEffect(() => {
    if (orderId) {
      handlePaymentVerification(orderId, amount, isPid);
    }
  }, [orderId, amount, isPid]);

  const handlePaymentVerification = async (
    orderId: string,
    amount: number,
    isPid: string | null
  ) => {
    try {
      const response = await fetch("/api/nicepay/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, amount, isPid }),
      });

      const result = await response.json();
      setResult(result);
      setLoading(false);

      if (result.status === "paid") {
        handleConfetti();
      } else {
        console.error("결제 실패:", result);
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
      setResult({
        status: "error",
        message: "결제 확인 중 오류가 발생했습니다.",
      });
      setLoading(false);
    }
  };

  if (loading) {
    // 로딩 상태일 때 아무것도 렌더링하지 않거나 로딩 표시
    return <div>로딩 중...</div>;
  }

  return (
    <div className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-6 flex flex-col">
      {result?.status === "paid" ? (
        <>
          <div className="text-xl text-gray-400">구매가 완료되었습니다.</div>
          <span className="text-base text-gray-400">감사합니다!</span>
        </>
      ) : result?.message ? (
        <div className="text-xl text-gray-400">{result.message}</div>
      ) : (
        <div className="text-xl text-gray-400">
          결제 확인 중 오류가 발생했습니다.
        </div>
      )}
    </div>
  );
}
