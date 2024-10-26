"use client";

import { useEffect, useState } from "react";
import { revalidateCartCount } from "../../cart/actions";

interface IStatus {
  amount: number;
  status: string;
}

export default function PaySuccess() {
  const [statusData, setStatusData] = useState<IStatus | null>(null);
  // https://aurorafactory.vercel.app/paysuccess?orderId=1729780546854091&amount=30000&status=paid
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const amount = Number(query.get("amount"));
    const status = query.get("status");

    setStatusData({
      amount: amount,
      status: status || "unknown",
    });
  }, []);

  if (statusData === null) return <div>로딩 중...</div>;

  return (
    <div>
      {statusData.status === "paid" ? (
        <div className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-2xl mb-4">구매가 완료되었습니다.</div>
          <div>결제 금액: {statusData.amount}원</div>
          <div>이용해주셔서 감사합니다.</div>
        </div>
      ) : statusData.status === "ready" ? (
        <div className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-2xl mb-4">
            가상계좌 입금 완료 문자를 발송하였습니다.
          </div>
        </div>
      ) : (
        <div className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-2xl mb-4">
            결제가 실패했습니다. 다시 시도해 주세요.
          </div>
        </div>
      )}
    </div>
  );
}
