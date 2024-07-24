import bcrypt from 'bcrypt';

import { z } from 'zod';
import  { getSession, saveLoginSession } from '@/lib/session';
import { createUser, getUserIdWithEmail } from './repositories';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const signIn = async (data: any) => {
  console.log("signIn Data : ",data)
  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 데이터베이스에 사용자 정보 저장
  const user = await createUser(data, hashedPassword);
  const session = await getSession();
    session.id = user.id;
    await session.save();

    redirect("/");
};

export const isExistUser = async (
  data: any,
  ctx: z.RefinementCtx,
  flag: 'email' | 'username',
) => {
  const user =
    flag === 'email'
      ? await getUserIdWithEmail(data.email)
      : await getUserIdWithEmail(data.email)
  if (user) {
    ctx.addIssue({
      code: 'custom',
      message:
        flag === 'email'
          ? '해당 이메일로 가입된 회원이 이미 존재합니다.'
          : '이미 사용중인 이름입니다.',
      path: [flag === 'email' ? 'email' : 'username'],
      fatal: true, // 이슈 발생 시 다음 유효성 검사 실행 안 함
    });
  }
};