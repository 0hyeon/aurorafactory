"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "./db";
import { notFound, redirect } from "next/navigation";
import { SessionContent } from "./types";
import { getCartCount } from "@/app/(home)/components/action";

//세션 가져오기 - 복호화 된 쿠키 반환
export default async function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-aurorafac",
    password: process.env.COOKIE_PASSWORD!,
    // cookieOptions: {
    //   secure: process.env.NODE_ENV === "production",
    // },
  });
}

// 사용자 정보(id) 가져오기
export const getUserProfile = async () => {
  const session = await getSession();
  const user = session.id
    ? await db.user.findUnique({
        where: { id: session.id },
        select: { id: true, username: true, avatar: true },
      })
    : null;
  return user ? user : "";
};

export const getSessionId = async () => {
  const session = await getSession();
  return session.id;
};

// 로그인 - 사용자 정보를 암호화 후 쿠키에 저장
export const saveLoginSession = async (user: SessionContent) => {
  const session = await getSession();
  session.id = user.user_id ?? user.id;
  await session.save(); // 정보 암호화 후 쿠키에 저장
  // SMS 로그인이라면, 인증토큰 삭제
  user.user_id && (await db.sMSToken.delete({ where: { id: user.id } }));
  redirect("/");
};

// 로그아웃 - 쿠키에서 사용자 정보 제거
export const logout = async () => {
  "use server";
  const session = await getSession();
  session.destroy(); // 쿠키 제거
  redirect("/");
};
