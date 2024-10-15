// app/api/paymentWebhook/route.ts
import { NextResponse } from "next/server";
import qs from "qs";
import { updateCart } from "@/app/(home)/cart/actions";
import { sendTwilioVbankMsg } from "@/app/(home)/lostuser/services";

export async function POST(request: Request) {
  const bodyText = await request.text();
  const body = qs.parse(bodyText);

  const {
    resultCode, // 성공 여부
    tid, // 거래 키
    orderId, // 주문 ID
    amount,
    bankCode,
    bankName,
    accountNum,
    depositor,
    dueDate,
  } = body as {
    resultCode: string;
    tid: string;
    orderId: string;
    amount: string;
    bankCode: string;
    bankName: string;
    accountNum: string;
    depositor: string;
    dueDate: string;
  };

  console.log(
    "resultCode : ",
    resultCode,
    "tid : ",
    tid,
    "orderId : ",
    orderId,
    "amount : ",
    amount,
    "bankCode : ",
    bankCode,
    "bankName : ",
    bankName,
    "accountNum : ",
    accountNum,
    "depositor : ",
    depositor,
    "dueDate : ",
    dueDate
  );

  // 성공 코드가 "0000"인 경우에만 처리
  if (resultCode === "0000") {
    console.log("결제 이벤트 수신 성공:", resultCode);
    console.log("거래ID:", tid);

    const cartIds = orderId.split("-").map((id) => Number(id));
    const result = await updateCart({ cartIds, orderId });

    if (result.success) {
      await sendTwilioVbankMsg({ vbankNum: accountNum, phone: "01041096590" });
    } else {
      console.error("카트 업데이트 실패:", result.message);
    }
  } else {
    console.log("결제 인증 실패:", resultCode);
  }

  // 최종적으로 "OK"를 응답으로 반환
  return new Response("OK", {
    status: 200,
    headers: {
      "Content-Type": "text/html;charset=utf-8",
    },
  });
}
