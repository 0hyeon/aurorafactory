"use client";

import { useEffect, useState } from "react";
import { revalidateCartCount } from "../../cart/actions";

interface IStatus {
  amount: string;
  status: string;
  vbankNumber: string;
  vbank: string;
  vbankExpDate: string;
}

export default function PaySuccess() {
  const [statusData, setStatusData] = useState<IStatus | null>(null);
  useEffect(() => {
    const fetchStatus = async () => {
      const query = new URLSearchParams(window.location.search);
      const amount = query.get("amount") || "0";
      const status = query.get("status") || "unknown";
      const vbankNumber = query.get("vbankNumber") || "unknown";
      const vbank = query.get("vbank") || "unknown";
      const vbankExpDate = query.get("vbankExpDate") || "unknown";

      const date = new Date(vbankExpDate);
      const formattedDate = date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setStatusData({
        amount,
        status,
        vbankNumber,
        vbank,
        vbankExpDate,
      });

      // 서버에서 카트 데이터를 강제로 갱신하도록 호출
      revalidateCartCount();
    };

    const interval = setInterval(fetchStatus, 5000); // 5초마다 상태 확인

    fetchStatus(); // 초기 호출

    return () => clearInterval(interval); // 컴포넌트 unmount 시 제거
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
          <div>
            <div className="text-3xl mb-4">
              가상계좌 입금 완료 문자를 발송하였습니다. (5분내로발송)
            </div>
            <div className="text-2xl">
              <div>은행:{statusData.vbank}</div>
              <div>계좌번호:{statusData.vbankNumber}</div>
              <div>입금기한:{statusData.vbankExpDate}</div>
            </div>
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
