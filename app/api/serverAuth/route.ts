import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import qs, { ParsedQs } from "qs";
function generateSignData(
  tid: string | ParsedQs | string[] | ParsedQs[] | undefined,
  amount: string,
  ediDate: string,
  secretKey: string
) {
  const data = `${tid}${amount}${ediDate}${secretKey}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const body = qs.parse(bodyText);
  const { authResultCode, tid, orderId, amount, mallReserved, authResultMsg } =
    body;

  console.log("serverAuth : ", body);
  // serverAuth :  {
  //   authResultCode: '0000',
  //   authResultMsg: '인증 성공',
  //   tid: 'UT0014446m03012410242336006598',
  //   clientId: 'R2_8bad4063b9a942668b156d221c3489ea',
  //   orderId: '1729780546854091',
  //   amount: '30000',
  //   mallReserved: '{"phoneNumber":"01041096590","cartIds":"38"}',
  //   authToken: 'NICEUNTT7E22363DEB83A9D3B7986695575CC671',
  //   signature: 'ed52a90ef896d0c8b97529f46b2c6dfb1d8638de8eedd770f7953aeec5666f52'
  // }
  const clientKey =
    process.env.NODE_ENV === "production"
      ? `R2_8bad4063b9a942668b156d221c3489ea`
      : `S2_07a6c2d843654d7eb32a6fcc0759eef4`;

  const secretKey =
    process.env.NODE_ENV === "production"
      ? `731f20c8498345b1ba7db90194076451`
      : `09899b0eb73a44d69be3c159a1109416`;
  const authHeader =
    "Basic " + Buffer.from(`${clientKey}:${secretKey}`).toString("base64");
  const ediDate = new Date().toISOString();
  const signData = generateSignData(tid, String(amount), ediDate, secretKey);
  const apiBaseUrl =
    process.env.NODE_ENV === "production"
      ? "https://api.nicepay.co.kr/v1/payments"
      : "https://sandbox-api.nicepay.co.kr/v1/payments";

  try {
    // Nicepay 결제 승인 API 호출
    const response = await fetch(
      `${apiBaseUrl}/${tid}`,
      // `https://api.nicepay.co.kr/v1/payments/${tid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: String(amount),
          ediDate: ediDate,
          signData: signData,
        }),
      }
    );

    const responseBody = await response.json();
    console.log("serverAuth2 : ", responseBody);
    // serverAuth2 :  {
    //   resultCode: '0000',
    //   resultMsg: '정상 처리되었습니다.',
    //   tid: 'UT0014446m03012410242336006598',
    //   cancelledTid: null,
    //   orderId: '1729780546854091',
    //   ediDate: '2024-10-24T23:36:02.894+0900',
    //   signature: 'd767b7895f58d3bc9c648e0de1829b2a27906e5278e461904f60543a17dc93cb',
    //   status: 'ready',
    //   paidAt: '2024-10-24T23:36:02.000+0900',
    //   failedAt: '0',
    //   cancelledAt: '0',
    //   payMethod: 'vbank',
    //   amount: 30000,
    //   balanceAmt: 30000,
    //   goodsName: '0.5T 라미봉투 10*10 (흰색)',
    //   mallReserved: '{"phoneNumber":"01041096590","cartIds":"38"}',
    //   useEscrow: false,
    //   currency: 'KRW',
    //   channel: 'pc',
    //   approveNo: null,
    //   buyerName: null,
    //   buyerTel: null,
    //   buyerEmail: 'test@abc.com',
    //   receiptUrl: 'https://npg.nicepay.co.kr/issue/IssueLoader.do?type=0&innerWin=Y&TID=UT0014446m03012410242336006598',
    //   mallUserId: null,
    //   issuedCashReceipt: false,
    //   coupon: null,
    //   card: null,
    //   vbank: {
    //     vbankCode: '004',
    //     vbankName: '국민은행',
    //     vbankNumber: '48809073080001',
    //     vbankExpDate: '2024-10-31T23:59:59.000+0900',
    //     vbankHolder: '김영현_NICE'
    //   },
    //   bank: null,
    //   cellphone: null,
    //   cancels: null,
    //   cashReceipts: null,
    //   messageSource: 'nicepay'
    // }
    if (responseBody.resultCode === "0000") {
      // 승인 성공 시, PaySuccess 페이지로 승인 결과 전달

      const redirectBaseUrl =
        process.env.NODE_ENV === "production"
          ? "https://aurorafactory.shop"
          : "http://localhost:3000";
      const redirectUrl = `${redirectBaseUrl}/paysuccess?amount=${
        amount || 0
      }&status=${responseBody.status || "unknown"}`;

      console.log(`Redirecting to URL: ${redirectUrl}`);
      // const redirectUrl =
      //   process.env.NODE_ENV === "production"
      //     ? `https://aurorafactory.shop/paysuccess?amount=${amount}&status=${responseBody.status}`
      //     : `https://localhost:3000/paysuccess?amount=${amount}&status=${responseBody.status}`;
      return NextResponse.redirect(redirectUrl);
    } else {
      return NextResponse.json({
        status: "failed",
        message: responseBody.resultMsg,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      status: "error",
      message: "Server error",
      error: error,
    });
  }
}
