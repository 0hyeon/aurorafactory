'use server';

import { NextResponse } from 'next/server';

export async function NicePayVerify(orderId: string, amount: number) {
  if (!orderId || typeof orderId !== 'string') {
    return NextResponse.json({ message: 'Invalid orderId' }, { status: 400 });
  }

  const clientKey = 'S2_07a6c2d843654d7eb32a6fcc0759eef4';
  const secretKey = '09899b0eb73a44d69be3c159a1109416';

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
