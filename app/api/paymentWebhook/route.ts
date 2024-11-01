//api/paymentWebhook/route.ts
import { getCachedLikeStatus } from "@/app/(admin)/actions";
import {
  revalidateCartCount,
  updateCancleCart,
  updateCart,
} from "@/app/(home)/cart/actions";
import {
  sendTwilioCalcledMsg,
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
  const {
    resultCode,
    tid,
    orderId,
    amount,
    vbank,
    goodsName,
    mallReserved,
    status,
    buyerTel,
  } = body;
  // webhook :  {
  //   mallReserved: null,
  //   issuedCashReceipt: false,
  //   buyerTel: null,
  //   orderId: '1730452398297070',
  //   signature: 'aab654dad8ca6009b4f8a0c126c9de828b414d946c2d1b5eb8200d9519c279df',
  //   cashReceipts: null,
  //   buyerEmail: 'test@abc.com',
  //   resultCode: '0000',
  //   channel: 'pc',
  //   tid: 'UT0014446m01012411011813553814',
  //   balanceAmt: 0,
  //   failedAt: '0',
  //   bank: null,
  //   payMethod: 'kakaopay',
  //   mallUserId: null,
  //   cellphone: null,
  //   ediDate: '2024-11-01T18:17:31.496+0900',
  //   currency: 'KRW',
  //   goodsName: '0.5T 라미봉투 10*10 (흰색)',
  //   vbank: null,
  //   cancelledTid: 'UT0014446m01012411011813553814',
  //   amount: 30000,
  //   coupon: { couponAmt: 0 },
  //   cancelledAt: '2024-11-01T18:17:31.000+0900',
  //   useEscrow: false,
  //   approveNo: null,
  //   messageSource: 'nicepay',
  //   buyerName: null,
  //   resultMsg: '정상 처리되었습니다.',
  //   cancels: [
  //     {
  //       reason: '01:',
  //       amount: 30000,
  //       couponAmt: 0,
  //       cancelledAt: '2024-11-01T18:17:31.000+0900',
  //       receiptUrl: 'https://npg.nicepay.co.kr/issue/IssueLoader.do?type=0&innerWin=Y&TID=UT0014446m01012411011813553814',
  //       tid: 'UT0014446m01012411011813553814'
  //     }
  //   ],
  //   paidAt: '2024-11-01T18:13:57.000+0900',
  //   receiptUrl: 'https://npg.nicepay.co.kr/issue/IssueLoader.do?type=0&innerWin=Y&TID=UT0014446m01012411011813553814',
  //   card: {
  //     cardNum: null,
  //     cardName: '카카오머니',
  //     isInterestFree: false,
  //     canPartCancel: true,
  //     acquCardCode: '40',
  //     cardCode: '40',
  //     cardQuota: 0,
  //     cardType: 'credit',
  //     acquCardName: '카카오머니'
  //   },
  //   status: 'cancelled'
  // }
  const reservedInfo =
    mallReserved && mallReserved.startsWith("{")
      ? JSON.parse(mallReserved)
      : {};
  const phoneNumber = reservedInfo.phoneNumber || "기본 값";
  const cartIds = reservedInfo.cartIds
    ? reservedInfo.cartIds.split("-").map(Number)
    : [];

  if (resultCode === "0000" && status === "cancelled") {
    //1730451403377321, 1730452398297070
    const updateResult = await updateCancleCart({
      orderId: orderId,
      stats: "결제취소",
    });
    console.log("updateResult : ", updateResult);
    console.log("orderId : ", orderId);

    if (!updateResult.success) {
      return new Response(updateResult.message, { status: 500 });
    }
    sendTwilioCalcledMsg({
      goodsName: goodsName,
      phone: buyerTel,
    }).catch((error) => {
      console.error("Twilio 메시지 전송 오류:", error);
    });
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } else if (resultCode === "0000" && status === "") {
    // 휴대폰결제
    const updateResult = await updateCart({
      cartIds: cartIds, // cartIds 배열 사용
      orderId: orderId,
      stats: "결제완료",
    });
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
  } else if (resultCode === "0000" && status === "ready") {
    // 가상계좌 발급 후 Twilio 메시지 전송 (입금 전 로직)
    const updateResult = await updateCart({
      cartIds: cartIds, // cartIds 배열 사용
      orderId: orderId,
      stats: "입금대기",
    });
    if (!updateResult.success) {
      return new Response(updateResult.message, { status: 500 });
    }
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
  } else if (resultCode === "0000" && status === "paid") {
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
