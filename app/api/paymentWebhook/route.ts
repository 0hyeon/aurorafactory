//api/paymentWebhook/route.ts
import { updateCart } from "@/app/(home)/cart/actions";
import {
  sendTwilioVbankMsg,
  sendTwilioVbankSuccessMsg,
} from "@/app/(home)/lostuser/services";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const bodyText = await request.text();
  const body = JSON.parse(bodyText);
  console.log("webhook : ", body);
  const { resultCode, tid, orderId, amount, vbank, goodsName, mallReserved } =
    body;
  const reservedInfo = JSON.parse(mallReserved);
  const phoneNumber = reservedInfo.phoneNumber;
  if (resultCode === "0000" && vbank !== null && body.status === "ready") {
    console.log("가상계좌 발급");

    // 가상계좌 발급 후 Twilio 메시지 전송 (입금 전 로직)
    await sendTwilioVbankMsg({
      goodsName: goodsName,
      bankName: vbank.vbankName,
      accountNum: vbank.vbankNumber,
      dueDate: vbank.vbankExpDate,
      phone: phoneNumber, // mallReserved의 phoneNumber 값 사용
      price: amount,
    });
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  }
  // 가상계좌 입금 완료 로직
  else if (resultCode === "0000" && vbank !== null && body.status === "paid") {
    console.log("입금완료로직발동:");

    // 입금 완료  메시지 전송
    await sendTwilioVbankSuccessMsg({
      goodsName: goodsName,
      phone: phoneNumber,
      price: amount,
    });

    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  } else {
    console.log("결제 인증 실패:", resultCode);
    return new Response("결제 인증 실패", { status: 400 });
  }
}
