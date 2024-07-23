// /app/api/verify-payment/action.ts
'use server';

import { NextResponse } from 'next/server';

export async function NicePayVerify(orderId: string) {
  if (!orderId || typeof orderId !== 'string') {
    return NextResponse.json({ message: 'Invalid orderId' }, { status: 400 });
  }

  const clientKey = 'R2_8bad4063b9a942668b156d221c3489ea'; // 실제 클라이언트 키
  const secretKey = '731f20c8498345b1ba7db90194076451'; // 실제 비밀 키

  const authHeader = 'Basic ' + Buffer.from(`${clientKey}:${secretKey}`).toString('base64');

  try {
    const response = await fetch(`https://api.nicepay.co.kr/v1/payments/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        amount: 1004, // 실제 결제 금액
      }),
    });
    console.log("pay response : ",response)
    const data = await response.json();

    if (data.resultCode === '0000' && data.status === 'paid') {
      return { status: 'paid', ...data };
    } else {
      return { status: 'failed', message: data.resultMsg };
    }
  } catch (error) {
    return { status: 'error', message: 'Server error', error };
  }
}
