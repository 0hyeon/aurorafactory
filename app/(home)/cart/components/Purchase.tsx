'use client'; // 클라이언트 사이드에서만 실행됨

import Script from 'next/script';
import { CartWithProductOption } from './CartList';
import { updateCart } from '../action';

interface PurchaseProps {
  data: CartWithProductOption[];
}

export default function Purchase({ data }: PurchaseProps) {
  function generateNumericUniqueId(length: number = 16) {
    const now = new Date().getTime(); 
    const timestamp = now.toString().slice(-length);
    const random = Math.floor(Math.random() * Math.pow(10, length - timestamp.length)).toString().padStart(length - timestamp.length, '0');
    return timestamp + random;
  }

  async function serverAuth() {
    if (data.length === 0) {
      alert("옵션을 선택해주세요.");
      return;
    }
    const totalPrice = data.reduce((acc, item) => acc + item.totalPrice, 0);
    const productNames =
      data.length === 1
        ? data[0].option.product.title
        : `${data[0].option.product.title} 외${data.length - 1}개`;

    const orderId = generateNumericUniqueId();
    const cartIds = data.map((item) => item.id);
    if (typeof window !== 'undefined') {
      const pay_obj: any = window;
      const { AUTHNICE } = pay_obj;
      AUTHNICE.requestPay({
        clientId: 'S2_07a6c2d843654d7eb32a6fcc0759eef4',
        method: 'card',
        orderId: orderId,
        amount: Number(totalPrice),
        goodsName: productNames,
        returnUrl: `http://localhost:3000/paysuccess?orderId=${orderId}&amount=${totalPrice}`,
        fnError: (result: any) => {
          alert(
            '고객용 메시지 : ' +
              result.msg +
              '\n개발자 확인용 : ' +
              result.errorMsg
          );
          return;
        },
      });
    }
    const result = await updateCart({ cartIds, orderId });
    
    if (!result.success) {
      alert("주문을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(result.message);
      return;
    }
  }

  return (
    <>
      <Script src="https://pay.nicepay.co.kr/v1/js/" strategy="lazyOnload" />
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
