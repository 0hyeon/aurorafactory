"use client";

import Script from "next/script";
import { CartWithProductOption } from "./CartList";

interface PurchaseProps {
  data: CartWithProductOption[];
}

export default function Purchase({ data }: PurchaseProps) {
  const totalPrice = data.reduce((acc, item) => acc + item.totalPrice, 0);
  const productNames = data.map((item) => item.option.product.title).join(", ");

  const random = (length = 8) => {
    return Math.random().toString(16).substr(2, length);
  };

  function serverAuth() {
    if (typeof window !== "undefined") {
      const pay_obj: any = window;
      const { AUTHNICE } = pay_obj;
      AUTHNICE.requestPay({
        //NOTE :: 발급받은 클라이언트키 clientId에 따라 Server / Client 방식 분리
        clientId: "S2_07a6c2d843654d7eb32a6fcc0759eef4",
        method: "card",
        //NOTE :: 상품 구매 id 값
        orderId: random(),
        // NOTE :: 가격
        amount: Number(totalPrice),
        // NOTE :: 상품명
        goodsName: productNames,
        //NOTE :: API를 호출할 Endpoint 입력
        returnUrl: "http://localhost:3000/paysuccess",
        // NOTE :: err 발생시 실행 함수
        fnError: (result: any) => {
          alert(
            "고객용 메시지 : " +
              result.msg +
              "\n개발자 확인용 : " +
              result.errorMsg
          );
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
