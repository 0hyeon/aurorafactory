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
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);
    console.log("Webhook received:", body); // Incoming request body logging

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

    const reservedInfo =
      mallReserved && mallReserved.startsWith("{")
        ? JSON.parse(mallReserved)
        : {};
    const cartIds = reservedInfo.cartIds
      ? reservedInfo.cartIds.split("-").map(Number)
      : [];

    console.log("Parsed data:", {
      resultCode,
      status,
      orderId,
      amount,
      cartIds,
      buyerTel,
    }); // Parsed data logging
    // Webhook received: {
    //   mallReserved: '{"cartIds":"96"}',
    //   issuedCashReceipt: false,
    //   buyerTel: '01041096590',
    //   orderId: '1730507923005247',
    //   signature: '6c2c43098df4e0a04d0ad839b541eb193931ac7d4969420e37ab86c05efc241e',
    //   cashReceipts: null,
    //   buyerEmail: 'test@abc.com',
    //   resultCode: '0000',
    //   channel: 'pc',
    //   tid: 'UT0014446m01012411020940196498',
    //   balanceAmt: 30000,
    //   failedAt: '0',
    //   bank: null,
    //   payMethod: 'kakaopay',
    //   mallUserId: null,
    //   cellphone: null,
    //   ediDate: '2024-11-02T09:40:21.313+0900',
    //   currency: 'KRW',
    //   goodsName: '0.5T 라미봉투 10*10 (흰색)',
    //   vbank: null,
    //   cancelledTid: null,
    //   amount: 30000,
    //   coupon: { couponAmt: 0 },
    //   cancelledAt: '0',
    //   useEscrow: false,
    //   approveNo: null,
    //   messageSource: 'nicepay',
    //   buyerName: null,
    //   resultMsg: '정상 처리되었습니다.',
    //   cancels: null,
    //   paidAt: '2024-11-02T09:40:21.000+0900',
    //   receiptUrl: 'https://npg.nicepay.co.kr/issue/IssueLoader.do?type=0&innerWin=Y&TID=UT0014446m01012411020940196498',
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
    //   status: 'paid'
    // }

    if (resultCode === "0000" && status === "cancelled") {
      const updateResult = await updateCancleCart({
        orderId: orderId,
        stats: "결제취소",
      });
      console.log("Cancellation update result:", updateResult);

      if (!updateResult.success) {
        console.error("Cart update failed:", updateResult.message);
        return new Response(updateResult.message, { status: 500 });
      }

      sendTwilioCalcledMsg({ goodsName, phone: buyerTel }).catch((error) => {
        console.error("Twilio message send error:", error);
      });

      return new Response("OK", { status: 200 });
    } else if (resultCode === "0000" && status === "") {
      const updateResult = await updateCart({
        cartIds,
        orderId,
        stats: "결제완료",
      });
      console.log("Payment complete update result:", updateResult);

      if (!updateResult.success) {
        console.error("Cart update failed:", updateResult.message);
        return new Response(updateResult.message, { status: 500 });
      }

      sendTwilioVbankSuccessMsg({ goodsName, phone: buyerTel }).catch(
        (error) => {
          console.error("Twilio message send error:", error);
        }
      );

      return new Response("OK", { status: 200 });
    } else if (resultCode === "0000" && status === "ready") {
      const updateResult = await updateCart({
        cartIds,
        orderId,
        stats: "입금대기",
      });
      console.log("Waiting for deposit update result:", updateResult);

      if (!updateResult.success) {
        console.error("Cart update failed:", updateResult.message);
        return new Response(updateResult.message, { status: 500 });
      }

      sendTwilioVbankMsg({
        goodsName,
        bankName: vbank.vbankName,
        accountNum: vbank.vbankNumber,
        dueDate: vbank.vbankExpDate,
        phone: buyerTel,
        price: amount,
      }).catch((error) => {
        console.error("Twilio message send error:", error);
      });

      return new Response("OK", { status: 200 });
    } else if (resultCode === "0000" && status === "paid") {
      const updateResult = await updateCart({
        cartIds,
        orderId,
        stats: "결제완료",
      });
      console.log("Payment successful update result:", updateResult);

      if (!updateResult.success) {
        console.error("Cart update failed:", updateResult.message);
        return new Response(updateResult.message, { status: 500 });
      }

      sendTwilioVbankSuccessMsg({ goodsName, phone: buyerTel }).catch(
        (error) => {
          console.error("Twilio message send error:", error);
        }
      );

      return new Response("OK", { status: 200 });
    } else {
      console.error("Payment authentication failed:", resultCode);
      return new Response("결제 인증 실패", { status: 400 });
    }
  } catch (error) {
    console.error("Error occurred:", error); // General error logging
    return new Response("서버 오류", { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return new Response("OK", {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
