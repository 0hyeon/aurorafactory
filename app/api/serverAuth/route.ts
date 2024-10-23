import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function generateSignData(
  tid: string,
  amount: string,
  ediDate: string,
  secretKey: string
) {
  const data = `${tid}${amount}${ediDate}${secretKey}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

export async function POST(request: NextRequest) {
  const { orderId, amount, tid } = await request.json();
  const clientKey = "R2_8bad4063b9a942668b156d221c3489ea"; // 실제 운영 키
  const secretKey = "731f20c8498345b1ba7db90194076451"; // 실제 운영 시크릿 키

  const authHeader =
    "Basic " + Buffer.from(`${clientKey}:${secretKey}`).toString("base64");
  const ediDate = new Date().toISOString();
  const signData = generateSignData(tid, String(amount), ediDate, secretKey);

  try {
    // Nicepay 결제 승인 API 호출
    const response = await fetch(
      `https://api.nicepay.co.kr/v1/payments/${tid}`,
      {
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
      }
    );

    const responseBody = await response.json();
    console.log("serverAuth : ", responseBody);
    if (responseBody.resultCode === "0000") {
      // 승인 성공 시, PaySuccess 페이지로 승인 결과 전달
      const redirectUrl = `https://aurorafactory.vercel.app/paysuccess?orderId=${orderId}&amount=${amount}&status=paid`;
      return NextResponse.redirect(redirectUrl);
    } else {
      return NextResponse.json({
        status: "failed",
        message: responseBody.resultMsg,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      status: "error",
      message: "Server error",
      error: error,
    });
  }
}
