import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Helper function to generate signData using SHA256
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
  const { orderId, amount, isPid } = await request.json();
  const clientKey = "S2_af4543a0be4d49a98122e01ec2059a56";
  const secretKey = "9eb85607103646da9f9c02b128f2e5eef";

  // Base64 인코딩된 Authorization 헤더 생성
  const authHeader =
    "Basic " + Buffer.from(`${clientKey}:${secretKey}`).toString("base64");

  // ediDate와 signData 생성
  const ediDate = new Date().toISOString(); // ISO 8601 형식으로 현재 시간 생성
  const signData = generateSignData(isPid, String(amount), ediDate, secretKey);

  try {
    const response = await fetch(
      `https://sandbox-api.nicepay.co.kr/v1/payments/${isPid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader, // Authorization 헤더 추가
        },
        body: JSON.stringify({
          amount: String(amount),
          ediDate: ediDate,
          signData: signData,
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

    // resultCode가 0000인지 확인
    if (responseBody.resultCode === "0000") {
      return NextResponse.json({ status: "paid", ...responseBody });
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
