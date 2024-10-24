import Script from "next/script";
import { CartWithProductOption } from "./CartList";
import { cookies } from "next/headers";
import { IronSession } from "iron-session";
import { SessionContent } from "@/lib/types";

interface PurchaseProps {
  data: CartWithProductOption[];
  method: string;
  vbankHolder: string; // 가상계좌 사용자명 추가
  disabled: boolean;
  phoneNumber: string;
  totalPrice: number;
  user: IronSession<SessionContent>;
}

export default function Purchase({
  data,
  method,
  vbankHolder,
  disabled,
  phoneNumber,
  totalPrice,
  user,
}: PurchaseProps) {
  // 주문 ID 생성 함수
  function generateNumericUniqueId(length: number = 16) {
    const now = new Date().getTime();
    const timestamp = now.toString().slice(-length);
    const random = Math.floor(
      Math.random() * Math.pow(10, length - timestamp.length)
    )
      .toString()
      .padStart(length - timestamp.length, "0");
    return timestamp + random;
  }

  async function serverAuth() {
    if (data.length === 0) {
      alert("옵션을 선택해주세요.");
      return;
    }

    const productNames =
      data.length === 1
        ? data[0].option.product.title
        : `${data[0].option.product.title} 외 ${data.length - 1}개`;

    const cartIds = data.map((item) => item.id).join("-");
    const orderId = generateNumericUniqueId();

    const finalPhoneNumber = method === "vbank" ? phoneNumber : user.phone;

    const mallReserved = JSON.stringify({ finalPhoneNumber, cartIds });

    if (typeof window !== "undefined") {
      const pay_obj: any = window;
      const { AUTHNICE } = pay_obj;

      // 결제 완료 후 성공 페이지로 이동하는 URL
      const returnUrl =
        process.env.NODE_ENV === "production"
          ? `https://aurorafactory.vercel.app/api/serverAuth`
          : `http://localhost:3000/api/serverAuth`;

      // PG사에 결제 요청 전송
      AUTHNICE.requestPay({
        clientId: "R2_8bad4063b9a942668b156d221c3489ea",
        method,
        orderId: orderId,
        amount: Number(totalPrice),
        goodsName: productNames,
        vbankHolder,
        mallReserved, // JSON 문자열로 전송
        returnUrl,
        fnError: (result: any) => {
          alert(
            "고객용 메시지: " +
              result.msg +
              "\n개발자 확인용: " +
              result.errorMsg
          );
          return;
        },
      });
    }
  }

  return (
    <>
      <Script src="https://pay.nicepay.co.kr/v1/js/" strategy="lazyOnload" />
      <div className="flex items-center justify-center">
        <button
          onClick={disabled ? undefined : serverAuth}
          disabled={disabled}
          className={`w-1/3 p-3 ${
            disabled
              ? "bg-gray-200 text-gray-400"
              : "bg-white text-blue-400 hover:bg-blue-400 hover:text-white"
          } rounded-md border-gray-400 border font-semibold text-base hover:border-blue-400 duration-300`}
        >
          구매하기
        </button>
      </div>
    </>
  );
}
