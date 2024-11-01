//api/paymentWebhook/route.ts
import { getCachedLikeStatus } from "@/app/(admin)/actions";
import { revalidateCartCount, updateCart } from "@/app/(home)/cart/actions";
import {
  sendTwilioVbankMsg,
  sendTwilioVbankSuccessMsg,
} from "@/app/(home)/lostuser/services";
import { getSession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const bodyText = await request.text();
  const body = JSON.parse(bodyText);
  console.log("webhook : ", body);

  const { resultCode, tid, orderId, amount, vbank, goodsName, mallReserved } =
    body;

  const reservedInfo =
    mallReserved && mallReserved.startsWith("{")
      ? JSON.parse(mallReserved)
      : {};
  const phoneNumber = reservedInfo.phoneNumber || "기본 값";
  const cartIds = reservedInfo.cartIds
    ? reservedInfo.cartIds.split("-").map(Number)
    : [];

  if (resultCode === "0000" && body.status === "cancelled") {
    const updateResult = await updateCart({
      cartIds: cartIds, // cartIds 배열 사용
      orderId: orderId,
      stats: "결제취소",
    });
    if (!updateResult.success) {
      return new Response(updateResult.message, { status: 500 });
    }
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } else if (resultCode === "0000" && body.status === "") {
    // 휴대폰결제
    const updateResult = await updateCart({
      cartIds: cartIds, // cartIds 배열 사용
      orderId: orderId,
      stats: "결제완료",
    });
    console.log("updateCart2 : ", updateResult);
    if (!updateResult.success) {
      return new Response(updateResult.message, { status: 500 });
    }

    // 독립적실행
    sendTwilioVbankSuccessMsg({
      goodsName: goodsName,
      phone: phoneNumber,
    }).catch((error) => {
      console.error("Twilio 메시지 전송 오류:", error);
    });

    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } else if (resultCode === "0000" && body.status === "ready") {
    // 가상계좌 발급 후 Twilio 메시지 전송 (입금 전 로직)

    // 독립적실행
    sendTwilioVbankMsg({
      goodsName: goodsName,
      bankName: vbank.vbankName,
      accountNum: vbank.vbankNumber,
      dueDate: vbank.vbankExpDate,
      phone: phoneNumber,
      price: amount,
    }).catch((error) => {
      console.error("Twilio 메시지 전송 오류:", error);
    });

    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  }
  // 가상계좌 입금 완료 로직
  else if (resultCode === "0000" && body.status === "paid") {
    // 카트 업데이트
    const updateResult = await updateCart({
      cartIds: cartIds,
      orderId: orderId,
      stats: "결제완료",
    });
    // 카트 업데이트 실패 처리
    if (!updateResult.success) {
      return new Response(updateResult.message, { status: 500 });
    }

    // 독립적실행 입금 완료  메시지 전송
    sendTwilioVbankSuccessMsg({
      goodsName: goodsName,
      phone: phoneNumber,
    }).catch((error) => {
      console.error("Twilio 메시지 전송 오류:", error);
    });

    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } else {
    console.log("결제 인증 실패:", resultCode);
    return new Response("결제 인증 실패", { status: 400 });
  }
}
export async function GET(request: Request) {
  return new Response("OK", {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
// https://www.aurorafactory.shop/paysuccess?amount=30000&status=paid
