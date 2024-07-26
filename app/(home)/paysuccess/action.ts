'use server';

export async function NicePayVerify(orderId: string, amount: number) {
  if (!orderId || typeof orderId !== 'string') {
    return { status: 400, message: 'Invalid orderId' };
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
    if (!response.ok) {
      return { status: response.status, message: 'API request failed' };
    }

    const data = await response.json();
    console.log(data)

    if (data.resultCode === '0000' && data.status === 'paid') {
      return { status: 'paid', ...data };
    } else {
      return { status: 'failed', message: data.resultMsg };
    }
  } catch (error) {
    console.log("nicepay verify error : ", error);
    return { status: 'error', message: 'Server error', error: error };
  }
}
