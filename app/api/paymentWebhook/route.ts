// app/api/paymentWebhook/route.ts
import { NextResponse } from "next/server";
import qs from "qs";
import { updateCart } from "@/app/(home)/cart/actions";
import { sendTwilioVbankMsg } from "@/app/(home)/lostuser/services";

export async function POST(request: Request) {
  const bodyText = await request.text();
  console.log("bodyText : ", bodyText);
  const body = JSON.parse(bodyText);
  //bodyText :  {"resultCode":"0000","resultMsg":"가상계좌 발급 성공",
  //"tid":"UTWEBHOOKm03012410161928322466","cancelledTid":null,
  //"orderId":"202410161928324088","ediDate":"2024-10-16T19:28:32.364+0900",
  //"signature":"461381fbfed93f7d0284d25ae522bf6668d941997b4e090b6333e6abcb2bb9e0",
  //"status":"ready","paidAt":"2024-10-16T19:28:32.364+0900",
  //"failedAt":"0","cancelledAt":"0","payMethod":"vbank",
  //"amount":10000,"balanceAmt":0,"goodsName":"나이스페이테스트상품",
  //"mallReserved":"웹훅 등록/수정 시 자동으로 응답되는 TEST 데이터 입니다.
  //(This is automatically generated TEST data for registering/updating a webhook)",
  //"useEscrow":false,"currency":"KRW","channel":"PC","approveNo":"000000",
  //"buyerName":null,"buyerTel":null,"buyerEmail":null,
  //"receiptUrl":"https://npg.nicepay.co.kr/issue/issueLoader.do?type=0&innerWin=Y&TID=UTWEBHOOKm03012410161928322466",
  //"mallUserId":null,"issuedCashReceipt":false,"coupon":null,"card":null,
  //"vbank":{"vbankCode":"04","vbankName":"국민은행","vbankNumber":"N123412341234","vbankExpDate":"","vbankHolder":"홍길동"},
  //"cancels":null,"cashReceipts":null,"messageSource":"nicepay","bank":null}
  const { resultCode, resultMsg, tid, orderId, amount, mallReserved, vbank } =
    body as {
      resultCode: string;
      resultMsg: string;
      tid: string;
      orderId: string;
      amount: number;
      mallReserved: string;
      vbank: {
        vbankCode: string;
        vbankName: string;
        vbankNumber: string;
        vbankHolder: string;
        vbankExpDate: string;
      };
    };

  const {
    vbankCode: bankCode,
    vbankName: bankName,
    vbankNumber: accountNum,
    vbankHolder: depositor,
    vbankExpDate: dueDate,
  } = vbank || {};

  // 이제 콘솔 로그에서 각 필드가 제대로 출력되는지 확인
  console.log(
    "resultCode : ",
    resultCode,
    "tid : ",
    tid,
    "orderId : ",
    orderId,
    "amount : ",
    amount,
    "bankCode : ",
    bankCode,
    "bankName : ",
    bankName,
    "accountNum : ",
    accountNum,
    "depositor : ",
    depositor,
    "dueDate : ",
    dueDate
  );

  if (resultCode === "0000") {
    console.log("결제 이벤트 수신 성공:", resultCode);
    console.log("거래ID:", tid);

    if (resultCode == "0000" && resultMsg === "가상계좌 발급 성공") {
      const cartIds = orderId.split("-").map((id) => Number(id));
      // const result = await updateCart({ cartIds, orderId });
      await sendTwilioVbankMsg({
        bankName,
        accountNum,
        depositor,
        dueDate,
        phone: mallReserved,
      });
    }
    // else {
    //   console.error("카트 업데이트 실패:", result.message);
    // }
  } else {
    console.log("결제 인증 실패:", resultCode);
  }

  // 최종적으로 "OK"를 응답으로 반환
  return new Response("OK", {
    status: 200,
    headers: {
      "Content-Type": "text/html;charset=utf-8",
    },
  });
}
