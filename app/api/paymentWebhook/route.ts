// app/api/paymentWebhook/route.ts
import { NextResponse } from "next/server";
import qs from "qs";
import { updateCart } from "@/app/(home)/cart/actions";

export async function POST(request: Request) {
  const bodyText = await request.text();
  const body = qs.parse(bodyText);

  const {
    authResultCode,
    tid,
    orderId,
    amount,
    bankCode,
    bankName,
    accountNum,
    depositor,
    dueDate,
  } = body as {
    authResultCode: string;
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
    "authResultCode : ",
    authResultCode,
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
  if (authResultCode === "0000") {
    console.log("결제 이벤트 수신 성공:", authResultCode);
    console.log("거래ID:", tid);

    // `orderId`와 연관된 cartIds를 추출하거나 이미 `cartIds`가 주어졌다고 가정
    const cartIds = orderId.split("-").map((id) => Number(id));

    const result = await updateCart({ cartIds, orderId });

    if (result.success) {
      return NextResponse.json({ message: "웹훅 처리 완료" });
    } else {
      return NextResponse.json({ message: result.message }, { status: 500 });
    }
  } else {
    console.log("결제 인증 실패:", authResultCode);
    return NextResponse.json({ message: "결제 인증 실패" }, { status: 400 });
  }
}
