import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "./db";
import { redirect } from "next/navigation";
import { SessionContent } from "./types";
import { revalidateTag } from "next/cache";

// 세션을 가져오는 함수
export async function getSession(session: any) {
  return await getIronSession<SessionContent>(session, {
    cookieName: "delicious-aurorafac",
    password: process.env.COOKIE_PASSWORD!,
  });
}
export default function getSessionCarrot() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-aurorafac",
    password: process.env.COOKIE_PASSWORD!,
  });
}

// // 사용자 정보(id) 가져오기
export const getUserProfile = async (session: any) => {
  // const session = await getSession();
  const user = session.id
    ? await db.user.findUnique({
        where: { id: session.id },
        select: { id: true, username: true, avatar: true },
      })
    : null;
  return user ? user : "";
};

// // 세션 ID 가져오기
// export const getSessionId = async () => {
//   const session = await getSession();
//   return session.id;
// };

// // 로그인 - 사용자 정보를 암호화 후 쿠키에 저장
export const saveLoginSession = async (session: any, user: SessionContent) => {
  console.log("session : ", session);
  // const session = await getSession();
  session.id = user.user_id ?? user.id;
  session.phone = user.phone ?? user.phone;
  await session.save(); // 정보 암호화 후 쿠키에 저장
  // SMS 로그인이라면, 인증토큰 삭제
  user.user_id && (await db.sMSToken.delete({ where: { id: user.id } }));
  redirect("/");
};
