"use client";

import { useEffect, useState } from "react";
import { handlePaymentVerification } from "@/lib/hooks/usePaymenUtil";
import { triggerConfetti } from "@/lib/hooks";

interface IStatus {
  amount: number;
  balanceAmt: number;
  buyerEmail: string;
  currency: string;
  ediDate: string;
  failedAt: string;
  goodsName: string;
  issuedCashReceipt: boolean;
  mallReserved: string;
  messageSource: string;
  orderId: string;
  paidAt: string;
  payMethod: string;
  receiptUrl: string;
  resultCode: string;
  resultMsg: string;
  signature: string;
  status: string;
  tid: string;
  message: string;
  useEscrow: boolean;
  vbank: {
    vbankCode: string;
    vbankExpDate: string;
    vbankHolder: string;
    vbankName: string;
    vbankNumber: string;
  };
}

export default function PaySuccess() {
  const [statusData, setStatusData] = useState<IStatus | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const orderId = query.get("orderId");
    const amount = Number(query.get("amount"));
    const tid = query.get("tid");
    const verifyPayment = async () => {
      if (orderId && amount && tid) {
        const verificationResult = await handlePaymentVerification(
          orderId,
          amount,
          tid
        );
        // console.log("verificationResult : ", verificationResult);
        setStatusData(verificationResult as IStatus);
        if (verificationResult.status === "paid") {
          triggerConfetti();
        }
      }
    };

    verifyPayment();
  }, []);

  if (statusData === null) return <div>로딩 중...</div>;

  return (
    <div>
      {statusData.status === "paid" ? (
        <div className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-2xl mb-4">구매가 완료되었습니다.</div>
          <div>이용해주셔서 감사합니다.</div>
        </div>
      ) : (
        <div>{statusData.message}</div>
      )}
      {statusData.status === "ready" ? (
        <div className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-2xl mb-4">
            가상계좌 입금대기입니다 문자발송 {statusData.resultMsg}
          </div>
          <div>상품명 : {statusData.goodsName}</div>
          <div>금액 : {statusData.amount}원</div>
          <div>은행명 : {statusData.vbank.vbankName}</div>
          <div>예금주명 : {statusData.vbank.vbankHolder}</div>
          <div>입금계좌 : {statusData.vbank.vbankNumber}</div>
        </div>
      ) : (
        <div>{statusData.message}</div>
      )}
    </div>
  );
}
