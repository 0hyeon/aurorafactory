"use client";

import { useEffect, useState } from "react";
import { handlePaymentVerification } from "@/lib/hooks/usePaymenUtil";
import { triggerConfetti } from "@/lib/hooks";

interface IStatus {
  status: string;
  message: string;
}

export default function PaySuccess() {
  const [status, setStatus] = useState<any>({ status: "", message: "" });

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const orderId = query.get("orderId");
    const amount = Number(query.get("amount"));
    const tid = query.get("tid");
    // https://aurorafactory.vercel.app/paysuccess?
    // orderId=1729439356280690&
    // amount=30000&
    // tid=UT0014446m03012410210049332840
    const verifyPayment = async () => {
      if (orderId && amount && tid) {
        const verificationResult = await handlePaymentVerification(
          orderId,
          amount,
          tid
        );
        console.log("verificationResult : ", verificationResult);
        setStatus(verificationResult);
        if (verificationResult.status === "paid") {
          triggerConfetti();
        }
      }
    };

    verifyPayment();
  }, []);

  if (status === null) return <div>로딩 중...</div>;

  return (
    <div>
      {status === "paid" ? (
        <div>구매가 완료되었습니다.</div>
      ) : (
        <div>{status.message}</div>
      )}
      {status === "ready" ? (
        <div>
          <div>{status.resultMsg}</div>
          <div>상품명 : {status.goodsName}</div>
          <div>금액 : {status.amount}</div>
          <div>은행명 : {status.vbank.vbankName}</div>
          <div>입금계좌 : {status.vbank.vbankNumber}</div>
          <div>예금주명 : {status.vbank.vbankNumber}</div>
        </div>
      ) : (
        <div>{status.message}</div>
      )}
    </div>
  );
}
