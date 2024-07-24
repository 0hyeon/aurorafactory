import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST() {
  const session = await getSession();

  if (session) {
    session.destroy(); // 세션 제거
  }

  return NextResponse.redirect('/'); // 홈 페이지로 리디렉션
}
