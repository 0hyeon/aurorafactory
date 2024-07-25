import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { orderId, amount } = await request.json();
  console.log("orderId, amount : ", orderId, amount);
  const clientKey = 'S2_07a6c2d843654d7eb32a6fcc0759eef4';
  const secretKey = '09899b0eb73a44d69be3c159a1109416';

  const authHeader = 'Basic '+Buffer.from(`${clientKey}:${secretKey}`).toString('base64');

  console.log("authHeader:", authHeader); // 디버깅을 위해 인증 헤더를 로그로 출력

  try {
    const response = await fetch(`https://api.nicepay.co.kr/v1/payments/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'UjJfOGJhZDQwNjNiOWE5NDI2NjhiMTU2ZDIyMWMzNDg5ZWE6NzMxZjIwYzg0OTgzNDViMWJhN2RiOTAxOTQwNzY0NTE=',
      },
      body: JSON.stringify({ amount }),
    });

    const responseBody = await response.json(); // 응답 본문을 한 번만 읽음
    console.log("Response body: ", responseBody);

    if (!response.ok) {
      console.error('API request failed:', responseBody);
      return NextResponse.json({ message: 'API request failed', error: responseBody }, { status: response.status });
    }

    if (responseBody.resultCode === '0000' && responseBody.status === 'paid') {
      return NextResponse.json({ status: 'paid', ...responseBody });
    } else {
      return NextResponse.json({ status: 'failed', message: responseBody.resultMsg });
    }
  } catch (error) {
    console.error("nicepay verify error: ", error);
    return NextResponse.json({ status: 'error', message: 'Server error', error: error });
  }
}
