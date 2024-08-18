// app/api/serverAuth/route.ts
import { NextResponse } from "next/server";
import qs from "qs";

export async function POST(request: Request) {
  // application/x-www-form-urlencoded로 전송된 데이터를 파싱합니다.
  const bodyText = await request.text();
  const body = qs.parse(bodyText);

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

  // 인증 결과를 확인합니다.
  if (authResultCode === "0000") {
    console.log("인증 성공:", authResultMsg);
    console.log("TID:", tid);

    // 결제 승인을 위한 추가 작업 수행 가능
    // 예를 들어 승인 API를 호출하여 결제를 완료합니다.

    const redirectUrl = `http://localhost:3000/paysuccess?orderId=${orderId}&amount=${amount}&tid=${tid}`;
    return NextResponse.redirect(redirectUrl);

    // return NextResponse.json({
    //   message: "결제 인증이 성공적으로 처리되었습니다.",
    // });
  } else {
    console.log("인증 실패:", authResultMsg);
    return NextResponse.json(
      { message: "결제 인증에 실패하였습니다." },
      { status: 400 }
    );
  }
}
