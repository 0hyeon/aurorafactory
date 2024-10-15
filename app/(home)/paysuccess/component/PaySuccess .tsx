// components/PaySuccess.tsx (클라이언트 컴포넌트)

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handlePaymentVerification } from "@/lib/hooks/usePaymenUtil";
import { triggerConfetti } from "@/lib/hooks";

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

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("orderId");
    const amt = query.get("amount");
    const pid = query.get("tid");

    console.log("orderId:", id, "amount:", amt, "tid:", pid);

    setOrderId(id);
    setAmount(Number(amt));
    setPid(pid);
  }, []);

  useEffect(() => {
    if (orderId) {
      (async () => {
        const verificationResult = await handlePaymentVerification(
          orderId,
          amount,
          isPid
        );
        setResult(verificationResult);
        setLoading(false);

        if (verificationResult.status === "paid") {
          triggerConfetti();
        } else {
          console.error("결제 실패:", verificationResult);
        }
      })();
    }
  }, [orderId, amount, isPid]);

  if (loading) {
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
