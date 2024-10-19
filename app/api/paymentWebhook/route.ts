//api/paymentWebhook/route.ts
import { updateCart } from "@/app/(home)/cart/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const bodyText = await request.text();
  const body = JSON.parse(bodyText);
  console.log("webhook : ", body);
  const { resultCode, tid, orderId, amount, vbank } = body;

  if (resultCode === "0000" && vbank) {
    console.log("가상계좌 입금 확인 성공:", tid);
    // 가상계좌 입금 확인이므로 장바구니 업데이트는 진행하지 않습니다.
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  } else {
    console.log("결제 인증 실패:", resultCode);
    return new Response("결제 인증 실패", { status: 400 });
  }
}
// webhook :  {
//   resultCode: '0000',
//   resultMsg: '카드 결제 성공',
//   tid: 'UTWEBHOOKm01012410192322432525',
//   cancelledTid: null,
//   orderId: '202410192322434348',
//   ediDate: '2024-10-19T23:22:43.832+0900',
//   signature: '7819bbeda66022c09ea35492540196b178c7509ff5a01134f06b3ee2baf38590',
//   status: 'paid',
//   paidAt: '2024-10-19T23:22:43.832+0900',
//   failedAt: '0',
//   cancelledAt: '0',
//   payMethod: 'card',
//   amount: 10000,
//   balanceAmt: 0,
//   goodsName: '나이스페이테스트상품',
//   mallReserved: '웹훅 등록/수정 시 자동으로 응답되는 TEST 데이터 입니다. (This is automatically generated TEST data for registering/updating a webhook)',
//   useEscrow: false,
//   currency: 'KRW',
//   channel: 'PC',
//   approveNo: '000000',
//   buyerName: null,
//   buyerTel: null,
//   buyerEmail: null,
//   receiptUrl: 'https://npg.nicepay.co.kr/issue/issueLoader.do?type=0&innerWin=Y&TID=UTWEBHOOKm01012410192322432525',
//   mallUserId: null,
//   issuedCashReceipt: false,
//   coupon: null,
//   card: {
//     cardCode: '04',
//     cardName: '삼성',
//     cardNum: null,
//     cardQuota: 0,
//     isInterestFree: false,
//     cardType: 'credit',
//     canPartCancel: true,
//     acquCardCode: '04',
//     acquCardName: '삼성'
//   },
//   vbank: null,
//   cancels: null,
//   cashReceipts: null,
//   messageSource: 'nicepay',
//   bank: null
// }

// -2
// 가상계좌 입금 확인 성공: UTWEBHOOKm03012410192329592526
// webhook :  {
//   resultCode: '0000',
//   resultMsg: '가상계좌 발급 성공',
//   tid: 'UTWEBHOOKm03012410192329592526',
//   cancelledTid: null,
//   orderId: '202410192329592758',
//   ediDate: '2024-10-19T23:29:59.138+0900',
//   signature: 'a1f65709dd7f06d022e6f5e7b152059e71777af5ca63288e46e30810c53a76de',
//   status: 'ready',
//   paidAt: '2024-10-19T23:29:59.138+0900',
//   failedAt: '0',
//   cancelledAt: '0',
//   payMethod: 'vbank',
//   amount: 10000,
//   balanceAmt: 0,
//   goodsName: '나이스페이테스트상품',
//   mallReserved: '웹훅 등록/수정 시 자동으로 응답되는 TEST 데이터 입니다. (This is automatically generated TEST data for registering/updating a webhook)',
//   useEscrow: false,
//   currency: 'KRW',
//   channel: 'PC',
//   approveNo: '000000',
//   buyerName: null,
//   buyerTel: null,
//   buyerEmail: null,
//   receiptUrl: 'https://npg.nicepay.co.kr/issue/issueLoader.do?type=0&innerWin=Y&TID=UTWEBHOOKm03012410192329592526',
//   mallUserId: null,
//   issuedCashReceipt: false,
//   coupon: null,
//   card: null,
//   vbank: {
//     vbankCode: '04',
//     vbankName: '국민은행',
//     vbankNumber: 'N123412341234',
//     vbankExpDate: '',
//     vbankHolder: '홍길동'
//   },
//   cancels: null,
//   cashReceipts: null,
//   messageSource: 'nicepay',
//   bank: null
// }
