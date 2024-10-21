import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Helper function to generate signData using SHA256
function generateSignData(tid: any, amount: any, ediDate: any, secretKey: any) {
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
          // 필요한 다른 필드들도 포함
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

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      status: "error",
      message: "Server error",
      error: error,
    });
  }
}
