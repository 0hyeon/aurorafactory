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
  revalidateCartCount();
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

  if (resultCode === "0000" && body.status === "") {
    // 필요한 로직이 있을 경우 추가
    // const updateResult = await updateCart({
    //   cartIds: cartIds, // cartIds 배열 사용
    //   orderId: orderId,
    // });
    // if (!updateResult.success) {
    //   return new Response(updateResult.message, { status: 500 });
    // }
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } else if (resultCode === "0000" && body.status === "ready") {
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
      headers: { "Content-Type": "text/html" },
    });
  }
  // 가상계좌 입금 완료 로직
  else if (resultCode === "0000" && body.status === "paid") {
    // 카트 업데이트
    const updateResult = await updateCart({
      cartIds: cartIds, // cartIds 배열 사용
      orderId: orderId,
    });
    console.log("updateResult : ", updateResult);
    // 카트 업데이트 실패 처리
    if (!updateResult.success) {
      return new Response(updateResult.message, { status: 500 });
    }
    await revalidateCartCount(); // 서버에서 무효화 호출
    console.log("revalidateCartCount");
    revalidateCartCount;
    // 입금 완료  메시지 전송
    await sendTwilioVbankSuccessMsg({
      goodsName: goodsName,
      phone: phoneNumber,
      price: amount,
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
