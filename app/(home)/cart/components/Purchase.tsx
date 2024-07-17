"use client";
import Script from "next/script";
import { CartWithProductOption } from "./CartList";

interface PurchaseProps {
  data: CartWithProductOption[];
}

export default function Purchase({ data }: PurchaseProps) {
  const success = (orderId: string) => {
    console.log("결제성공", orderId);
  };

  function serverAuth() {
    if (data.length === 0) {
      alert("옵션을 선택해주세요.");
      return;
    }
    const totalPrice = data.reduce((acc, item) => acc + item.totalPrice, 0);
    const productNames =
      data.length === 1
        ? data[0].option.product.title
        : `${data[0].option.product.title} 외${data.length - 1}개`;
    const random = (length = 8) => {
      return Math.random().toString(16).substr(2, length);
    };

    if (typeof window !== "undefined") {
      const pay_obj: any = window;
      const { AUTHNICE } = pay_obj;
      const orderId = random();

      AUTHNICE.requestPay({
        //NOTE :: 발급받은 클라이언트키 clientId에 따라 Server / Client 방식 분리
        clientId: "R2_8bad4063b9a942668b156d221c3489ea",
        method: "card",
        //NOTE :: 상품 구매 id 값
        orderId: orderId,
        // NOTE :: 가격
        amount: Number(totalPrice),
        // NOTE :: 상품명
        goodsName: productNames,
        //NOTE :: API를 호출할 Endpoint 입력
        returnUrl: `http://localhost:3000/paysuccess?orderId=${orderId}`,

        // NOTE :: err 발생시 실행 함수
        fnError: (result: any) => {
          alert(
            "고객용 메시지 : " +
              result.msg +
              "\n개발자 확인용 : " +
              result.errorMsg
          );
          return;
        },
      });
    }
  }

  return (
    <>
      <Script src="https://pay.nicepay.co.kr/v1/js/" />
      <div className="flex items-center justify-center">
        <button
          onClick={() => serverAuth()}
          className="w-1/3 p-3 bg-white hover:bg-blue-400 hover:text-white text-blue-400 rounded-md border-gray-400 border font-semibold text-base hover:border-blue-400 duration-300"
        >
          구매하기
        </button>
      </div>
    </>
  );
}
