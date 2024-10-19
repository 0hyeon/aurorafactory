import { updateCart } from "@/app/(home)/cart/actions";
import { NextResponse } from "next/server";
import qs from "qs"; // query string 파싱을 위한 라이브러리

export async function POST(request: Request) {
  const bodyText = await request.text();
  console.log("serverAuth : ", bodyText);

  // URL-encoded 데이터를 파싱합니다
  const body = qs.parse(bodyText);
  console.log("serverAuth : ", body);
  const { authResultCode, tid, orderId, amount, mallReserved, authResultMsg } =
    body;

  try {
    // mallReserved가 문자열이므로 JSON으로 파싱합니다.
    const parsedMallReserved = JSON.parse(mallReserved as string);
    const phoneNumber = parsedMallReserved?.phoneNumber || null;
    const cartIds = parsedMallReserved?.cartIds || null;

    if (typeof orderId === "string" && cartIds) {
      const [originalOrderId] = orderId.split("-");

      if (authResultCode === "0000") {
        console.log("인증 성공:", tid);
        console.log("authResultMsg : ", authResultMsg);

        if (authResultMsg === "인증 성공") {
          const redirectUrl =
            process.env.NODE_ENV === "production"
              ? `https://aurorafactory.vercel.app/paysuccess?orderId=${orderId}&amount=${amount}&tid=${tid}`
              : `http://localhost:3000/paysuccess?orderId=${orderId}&amount=${amount}&tid=${tid}`;

          return NextResponse.redirect(redirectUrl);
        } else {
          // 결제 인증이 아닌 경우 장바구니 업데이트
          const result = await updateCart({
            cartIds: cartIds.split("-").map(Number),
            orderId: originalOrderId,
          });
          if (result.success) {
            const redirectUrl =
              process.env.NODE_ENV === "production"
                ? `https://aurorafactory.vercel.app/paysuccess?orderId=${orderId}&amount=${amount}&tid=${tid}`
                : `http://localhost:3000/paysuccess?orderId=${orderId}&amount=${amount}&tid=${tid}`;

            return NextResponse.redirect(redirectUrl);
          } else {
            return NextResponse.json(
              {
                status: "failed",
                message: "장바구니 업데이트에 실패하였습니다.",
              },
              { status: 400 }
            );
          }
        }
      } else {
        console.log("인증 실패:", authResultCode);
        return NextResponse.json(
          { status: "failed", message: "결제 인증에 실패하였습니다." },
          { status: 400 }
        );
      }
    } else {
      console.error("cartIds 또는 orderId가 유효하지 않습니다.");
      return NextResponse.json(
        {
          status: "failed",
          message: "유효한 cartIds 또는 orderId가 없습니다.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("mallReserved 파싱 중 오류 발생:", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "mallReserved 파싱 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
