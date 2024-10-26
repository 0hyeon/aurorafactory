//api/paymentWebhook/route.ts
import { updateCart } from "@/app/(home)/cart/actions";
import {
  sendTwilioVbankMsg,
  sendTwilioVbankSuccessMsg,
} from "@/app/(home)/lostuser/services";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const bodyText = await request.text();
  const body = JSON.parse(bodyText);
  console.log("webhook : ", body);
  // 입금전
  // webhook :  {
  //   mallReserved: '{"phoneNumber":"01041096590","cartIds":"38"}',
  //   issuedCashReceipt: false,
  //   buyerTel: null,
  //   orderId: '1729694390718381',
  //   signature: '056fad515924d86f2c4534ea2094b952e17530c3a1619d89eaefdca29e8c4a9b',
  //   cashReceipts: null,
  //   buyerEmail: 'test@abc.com',
  //   resultCode: '0000',
  //   channel: 'pc',
  //   tid: 'UT0014446m03012410232340006205',
  //   balanceAmt: 30000,
  //   failedAt: '0',
  //   bank: null,
  //   payMethod: 'vbank',
  //   mallUserId: null,
  //   cellphone: null,
  //   ediDate: '2024-10-23T23:40:02.927+0900',
  //   currency: 'KRW',
  //   goodsName: '0.5T 라미봉투 10*10 (흰색)',
  //   vbank: {
  //     vbankHolder: '김영현_NICE',
  //     vbankNumber: '48719073202361',
  //     vbankName: '국민은행',
  //     vbankCode: '004',
  //     vbankExpDate: '2024-10-30T23:59:59.000+0900'
  //   },
  //   cancelledTid: null,
  //   amount: 30000,
  //   coupon: null,
  //   cancelledAt: '0',
  //   useEscrow: false,
  //   approveNo: null,
  //   messageSource: 'nicepay',
  //   buyerName: null,
  //   resultMsg: '정상 처리되었습니다.',
  //   cancels: null,
  //   paidAt: '2024-10-23T23:40:02.000+0900',
  //   receiptUrl: 'https://npg.nicepay.co.kr/issue/IssueLoader.do?type=0&innerWin=Y&TID=UT0014446m03012410232340006205',
  //   card: null,
  //   status: 'ready'
  // }

  //입금후
  //webhook :  {
  //   mallReserved: '{"phoneNumber":"01041096590","cartIds":"38"}',
  //   issuedCashReceipt: true,
  //   buyerTel: null,
  //   orderId: '1729697233988326',
  //   signature: '0e55d2767a54dea160a8ecafb45e1f98e9c1d265a5b52a34dcedacc3da24886d',
  //   cashReceipts: [
  //     {
  //       amount: 30000,
  //       receiptType: 'individual',
  //       orgTid: 'UT0014446m03012410240027232658',
  //       receiptTid: 'UT0014446m04012410240029238390',
  //       taxFreeAmt: 0,
  //       issueNo: '533107017',
  //       receiptUrl: 'https://npg.nicepay.co.kr/issue/IssueLoader.do?type=1&InnerWin=Y&TID=UT0014446m04012410240029238390',
  //       status: 'issueRequested'
  //     }
  //   ],
  //   buyerEmail: 'test@abc.com',
  //   resultCode: '0000',
  //   channel: 'pc',
  //   tid: 'UT0014446m03012410240027232658',
  //   balanceAmt: 30000,
  //   failedAt: '0',
  //   bank: null,
  //   payMethod: 'vbank',
  //   mallUserId: null,
  //   cellphone: null,
  //   ediDate: '2024-10-24T00:30:00.115+0900',
  //   currency: 'KRW',
  //   goodsName: '0.5T 라미봉투 10*10 (흰색)',
  //   vbank: {
  //     vbankHolder: '김영현_NICE',
  //     vbankNumber: '48689073040409',
  //     vbankName: '국민은행',
  //     vbankCode: '004',
  //     vbankExpDate: '2024-10-31T23:59:59.000+0900'
  //   },
  //   cancelledTid: null,
  //   amount: 30000,
  //   coupon: null,
  //   cancelledAt: '0',
  //   useEscrow: false,
  //   approveNo: null,
  //   messageSource: 'nicepay',
  //   buyerName: null,
  //   resultMsg: '정상 처리되었습니다.',
  //   cancels: null,
  //   paidAt: '2024-10-24T00:29:23.000+0900',
  //   receiptUrl: 'https://npg.nicepay.co.kr/issue/IssueLoader.do?type=0&innerWin=Y&TID=UT0014446m03012410240027232658',
  //   card: null,
  //   status: 'paid'
  // }
  const { resultCode, tid, orderId, amount, vbank, goodsName, mallReserved } =
    body;

  const reservedInfo = JSON.parse(mallReserved);
  const phoneNumber = reservedInfo.phoneNumber;
  const cartIds = reservedInfo.cartIds.split("-").map(Number); // cartIds를 배열로 변환

  if (resultCode === "0000" && body.status === "ready") {
    // 가상계좌 발급 후 Twilio 메시지 전송 (입금 전 로직)
    await sendTwilioVbankMsg({
      goodsName: goodsName,
      bankName: vbank.vbankName,
      accountNum: vbank.vbankNumber,
      dueDate: vbank.vbankExpDate,
      phone: phoneNumber, // mallReserved의 phoneNumber 값 사용
      price: amount,
    });
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  }
  // 가상계좌 입금 완료 로직
  else if (resultCode === "0000" && body.status === "paid") {
    // 카트 업데이트
    const updateResult = await updateCart({
      cartIds: cartIds, // cartIds 배열 사용
      orderId: orderId,
    });
    // 카트 업데이트 실패 처리
    if (!updateResult.success) {
      return new Response(updateResult.message, { status: 500 });
    }

    // 입금 완료  메시지 전송
    await sendTwilioVbankSuccessMsg({
      goodsName: goodsName,
      phone: phoneNumber,
      price: amount,
    });
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } else {
    console.log("결제 인증 실패:", resultCode);
    return new Response("결제 인증 실패", { status: 400 });
  }
}
