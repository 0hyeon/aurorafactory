import Script from "next/script";
import { cookies } from "next/headers";
import { IronSession } from "iron-session";
import { SessionContent } from "@/lib/types";

interface PurchaseProps {
  data: any[];
  method: string;
  vbankHolder: string; // 가상계좌 사용자명 추가
  disabled: boolean;
  phoneNumber: string;
  totalPrice: number;
  address: string;
  phone: string | null;
  username: string;
}

export default function Purchase({
  username,
  data,
  method,
  vbankHolder,
  disabled,
  phoneNumber,
  totalPrice,
  address,
  phone,
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

    const finalPhoneNumber = method === "vbank" ? phoneNumber : phone;
    const mallReserved = JSON.stringify({
      cartIds,
      username,
      address,
    });

    if (typeof window !== "undefined") {
      const pay_obj: any = window;
      const { AUTHNICE } = pay_obj;

      // 결제 완료 후 성공 페이지로 이동하는 URL
      const returnUrl =
        process.env.NODE_ENV === "production"
          ? `https://www.aurorafac.co.kr/api/serverAuth`
          : `http://localhost:3000/api/serverAuth`;

      const clientId =
        process.env.NODE_ENV === "production"
          ? `R2_8bad4063b9a942668b156d221c3489ea`
          : `S2_07a6c2d843654d7eb32a6fcc0759eef4`;
      AUTHNICE.requestPay({
        clientId,
        method,
        orderId: orderId,
        amount: Number(totalPrice),
        goodsName: productNames,
        vbankHolder,
        mallReserved, // JSON 문자열로 전송
        buyerTel: finalPhoneNumber,
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
      <div className="flex items-center justify-center md:pb-0 pb-6">
        <button
          onClick={disabled ? undefined : serverAuth}
          disabled={disabled}
          className={`w-full md:w-1/3 p-3  ${
            disabled
              ? "bg-gray-200 text-gray-400"
              : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white"
          } rounded-md border-gray-400 border font-semibold text-base hover:border-blue-600 duration-300`}
        >
          구매하기
        </button>
      </div>
    </>
  );
}
