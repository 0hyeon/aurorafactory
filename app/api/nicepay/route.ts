'use server';

import { NextResponse } from 'next/server';
import { NicePayVerify } from '../../(home)/paysuccess/action'; // 서버 측 함수 가져오기

export async function POST(request: Request) {
  const { orderId, amount } = await request.json();

  try {
    const result = await NicePayVerify(orderId, amount);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API 요청 오류:", error);
    return NextResponse.json({ status: 'error', message: '서버 오류' }, { status: 500 });
  }
}
