'use server';

import { NextResponse } from 'next/server';

export async function NicePayVerify(orderId: string, amount: number) {
  if (!orderId || typeof orderId !== 'string') {
    return NextResponse.json({ message: 'Invalid orderId' }, { status: 400 });
  }

  const clientKey = 'R2_8bad4063b9a942668b156d221c3489ea';
  const secretKey = '731f20c8498345b1ba7db90194076451';

  const authHeader = 'Basic ' + Buffer.from(`${clientKey}:${secretKey}`).toString('base64');
  console.log("authHeader : ", authHeader);
  
  try {
    const response = await fetch(`https://sandbox-api.nicepay.co.kr/v1/payments/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ amount }), // 요청 본문
    });
    console.log("pay_action response : ", response);

    if (!response.ok) {
      return NextResponse.json({ message: 'API request failed' }, { status: response.status });
    }

    const data = await response.json();
    if (data.resultCode === '0000' && data.status === 'paid') {
      return NextResponse.json({ status: 'paid', ...data });
    } else {
      return NextResponse.json({ status: 'failed', message: data.resultMsg });
    }
  } catch (error) {
    console.log("nicepay verify error : ", error);
    return NextResponse.json({ status: 'error', message: 'Server error', error: error });
  }
}
