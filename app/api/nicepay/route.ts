import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { orderId, amount, isPid } = await request.json();
  // console.log("orderId, amount : ", orderId, amount, isPid);
  const clientKey = "R2_8bad4063b9a942668b156d221c3489ea";
  const secretKey = "731f20c8498345b1ba7db90194076451";

  const authHeader =
    "Basic " + Buffer.from(`${clientKey}:${secretKey}`).toString("base64");

  // console.log("authHeader:", authHeader); // 디버깅을 위해 인증 헤더를 로그로 출력

  try {
    const response = await fetch(
      `https://sandbox-api.nicepay.co.kr/v1/payments/${isPid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ amount: String(amount) }),
      }
    );

    const responseBody = await response.json(); // 응답 본문을 한 번만 읽음
    // console.log("Response body: ", responseBody);

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
