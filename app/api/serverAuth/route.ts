// app/api/serverAuth/route.ts
import { updateCart } from "@/app/(home)/cart/actions";
import { NextResponse } from "next/server";
import qs from "qs";

export async function POST(request: Request) {
  // application/x-www-form-urlencoded로 전송된 데이터를 파싱합니다.
  const bodyText = await request.text();
  console.log("serverAuth : ", bodyText);
  const body = JSON.parse(bodyText);

  const {
    authResultCode,
    authResultMsg,
    tid,
    orderId,
    amount,
    authToken,
    signature,
  } = body as {
    authResultCode: string;
    authResultMsg: string;
    tid: string;
    orderId: string;
    amount: string;
    authToken: string;
    signature: string;
  };
  const [originalOrderId, cartIdsString] = orderId.split("-");
  const cartIds = cartIdsString ? cartIdsString.split("-").map(Number) : [];

  // 인증 결과를 확인합니다.
  if (authResultCode === "0000") {
    console.log("인증 성공:", authResultMsg);
    console.log("TID:", tid);

    // 장바구니 업데이트
    const result = await updateCart({ cartIds, orderId: originalOrderId });

    if (result.success) {
      const redirectUrl = `https://aurorafactory.vercel.app/paysuccess?orderId=${orderId}&amount=${amount}&tid=${tid}`;
      return NextResponse.redirect(redirectUrl);
    } else {
      return NextResponse.json(
        { message: "장바구니 업데이트에 실패하였습니다." },
        { status: 400 }
      );
    }
  } else {
    console.log("인증 실패:", authResultMsg);
    return NextResponse.json(
      { message: "결제 인증에 실패하였습니다." },
      { status: 400 }
    );
  }
}
