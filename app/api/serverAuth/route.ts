import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import qs, { ParsedQs } from "qs";
import { updateCart } from "@/app/(home)/cart/actions";
function generateSignData(
  tid: string | ParsedQs | string[] | ParsedQs[] | undefined,
  amount: string,
  ediDate: string,
  secretKey: string
) {
  const data = `${tid}${amount}${ediDate}${secretKey}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const body = qs.parse(bodyText);
    const {
      authResultCode,
      tid,
      orderId,
      amount,
      mallReserved,
      authResultMsg,
    } = body;

    console.log("Received body:", body); // Incoming request body logging

    const clientKey =
      process.env.NODE_ENV === "production"
        ? `R2_8bad4063b9a942668b156d221c3489ea`
        : `S2_07a6c2d843654d7eb32a6fcc0759eef4`;
    const secretKey =
      process.env.NODE_ENV === "production"
        ? `731f20c8498345b1ba7db90194076451`
        : `09899b0eb73a44d69be3c159a1109416`;
    const authHeader =
      "Basic " + Buffer.from(`${clientKey}:${secretKey}`).toString("base64");
    const ediDate = new Date().toISOString();
    const signData = generateSignData(tid, String(amount), ediDate, secretKey);
    const apiBaseUrl =
      process.env.NODE_ENV === "production"
        ? "https://api.nicepay.co.kr/v1/payments"
        : "https://sandbox-api.nicepay.co.kr/v1/payments";

    console.log("Making API request to:", `${apiBaseUrl}/${tid}`); // API request URL logging

    const response = await fetch(`${apiBaseUrl}/${tid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: String(amount),
        ediDate: ediDate,
        signData: signData,
      }),
    });

    const responseBody = await response.json();
    console.log("Received API response:", responseBody); // API response logging

    if (!response.ok) {
      console.error("API response not ok:", response.status, responseBody); // Log error if response is not ok
      return NextResponse.json(
        { status: "error", message: "API error", details: responseBody },
        { status: response.status }
      );
    }

    // Handling successful response
    if (responseBody.resultCode === "0000" && responseBody.status === "paid") {
      const reservedInfo = responseBody.mallReserved
        ? JSON.parse(responseBody.mallReserved)
        : {};
      const cartIds = reservedInfo.cartIds
        ? reservedInfo.cartIds.split("-").map(Number)
        : [];
      const updateResult = await updateCart({
        cartIds: cartIds,
        orderId: responseBody.orderId,
        stats: "결제완료",
      });

      if (!updateResult.success) {
        console.error("Failed to update cart:", updateResult.message); // Log cart update failure
        return new Response(updateResult.message, { status: 500 });
      }

      const redirectUrl = `${
        process.env.NODE_ENV === "production"
          ? "https://www.aurorafactory.shop"
          : "http://localhost:3000"
      }/paysuccess?amount=${amount || 0}&status=${
        responseBody.status || "unknown"
      }`;
      return NextResponse.redirect(redirectUrl);
    } else if (
      responseBody.resultCode === "0000" &&
      responseBody.status === "ready"
    ) {
      const redirectUrl = `${
        process.env.NODE_ENV === "production"
          ? "https://www.aurorafactory.shop"
          : "http://localhost:3000"
      }/paysuccess?amount=${amount || 0}&status=${
        responseBody.status || "unknown"
      }&vbank=${responseBody.vbank.vbankName || "unknown"}&vbankNumber=${
        responseBody.vbank.vbankNumber || "unknown"
      }&vbankExpDate=${responseBody.vbank.vbankExpDate || "unknown"}`;
      return NextResponse.redirect(redirectUrl);
    } else {
      console.error("Payment processing failed:", responseBody.resultMsg); // Log payment processing failure
      return NextResponse.json({
        status: "failed",
        message: responseBody.resultMsg,
      });
    }
  } catch (error) {
    console.error("Error occurred:", error); // Log any unexpected errors
    return NextResponse.json({
      status: "error",
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
