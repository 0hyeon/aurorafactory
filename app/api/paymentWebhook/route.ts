//api/paymentWebhook/route.ts
import { updateCart } from "@/app/(home)/cart/actions";
import { sendTwilioVbankMsg } from "@/app/(home)/lostuser/services";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const bodyText = await request.text();
  const body = JSON.parse(bodyText);
  console.log("webhook : ", body);
  const { resultCode, tid, orderId, amount, vbank, goodsName } = body;

  if (resultCode === "0000" && vbank !== null) {
    console.log("가상계좌 입금 확인 성공:", tid);
    await sendTwilioVbankMsg({
      goodsName: goodsName,
      bankName: vbank.vbankName,
      accountNum: vbank.vbankNumber,
      dueDate: vbank.vbankExpDate,
      phone: "01041096590",
    });
    // 가상계좌 입금 확인이므로 장바구니 업데이트는 진행하지 않습니다.
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  } else {
    console.log("결제 인증 실패:", resultCode);
    return new Response("결제 인증 실패", { status: 400 });
  }
}
