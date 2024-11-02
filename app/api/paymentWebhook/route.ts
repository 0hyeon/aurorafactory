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
      goodsName,
      resultCode,
      status,
      orderId,
      amount,
      cartIds,
      buyerTel,
    }); // Parsed data logging

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
