import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Helper function to generate signData using SHA256
function generateSignData(tid: any, amount: any, ediDate: any, secretKey: any) {
  const data = `${tid}${amount}${ediDate}${secretKey}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

export async function POST(request: NextRequest) {
  const { orderId, amount, isPid } = await request.json();
  const clientKey = "R2_8bad4063b9a942668b156d221c3489ea";
  const secretKey = "731f20c8498345b1ba7db90194076451";

  // 현재 시간 ISO 8601 형식으로 ediDate 생성
  const ediDate = new Date().toISOString();

  // signData 생성 (tid, amount, ediDate, secretKey)
  const signData = generateSignData(isPid, String(amount), ediDate, secretKey);

  const authHeader =
    "Basic " + Buffer.from(`${clientKey}:${secretKey}`).toString("base64");

  try {
    const response = await fetch(
      `https://sandbox-api.nicepay.co.kr/v1/payments/${isPid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: String(amount),
          ediDate: ediDate, // ediDate 추가
          signData: signData, // signData 추가
        }),
      }
    );

    const responseBody = await response.json();

    if (!response.ok) {
      console.error("API request failed:", responseBody);
      return NextResponse.json(
        { message: "API request failed", error: responseBody },
        { status: response.status }
      );
    }

    if (responseBody.resultCode === "0000" && responseBody.status === "paid") {
      return NextResponse.json({ status: "paid", ...responseBody });
    } else {
      return NextResponse.json({
        status: "failed",
        message: responseBody.resultMsg,
      });
    }
  } catch (error) {
    console.error("nicepay verify error: ", error);
    return NextResponse.json({
      status: "error",
      message: "Server error",
      error: error,
    });
  }
}
