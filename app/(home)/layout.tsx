import Profile from "@/components/profile/page";
import Header from "./components/header";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSession, getUserProfile } from "@/lib/session";
import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getCachedLikeStatus } from "../(admin)/actions";
import { logOut } from "./actions";

export default async function TabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const session = await getSession(cookieStore);

  // 만약 세션이 없으면 로그인 페이지로 리디렉션
  // if (!session?.id) {
  //   redirect("/login");
  // }

  const cartcount = await getCachedLikeStatus(session.id!);

  async function getUser() {
    const session = await getSession(cookieStore);
    if (session.id) {
      const user = await db.user.findUnique({
        where: {
          id: session.id,
        },
      });
      if (user) {
        return user;
      }
    }
    notFound();
  }

  async function Username() {
    const user = await getUser();
    return <h1>어서오세요! {user?.username}님</h1>;
  }

  return (
    <div className="w-full">
      {/* 상단 바 */}
      <div className="w-full fixed md:static z-10 md:z-0">
        <div className="bg-white pr-2 md:pr-0 h-auto py-2 md:p-4 border-b gap-4 flex items-center justify-end text-[12px] max-w-[1100px] mx-auto">
          {session.id ? (
            <>
              <Suspense fallback={"Hello!"}>
                <Username />
              </Suspense>
              <form action={logOut}>
                <button type="submit">로그아웃</button>
              </form>
            </>
          ) : (
            <>
              <div>
                <Link href="/signup">회원가입</Link>
              </div>
              <div>
                <Link href="/login">로그인</Link>
              </div>
            </>
          )}
        </div>

        {/* 헤더 */}
        <Header cartcount={cartcount || 0} />
      </div>

      {/* 메인 컨텐츠 */}
      <main className="w-full mx-auto md:px-0 px-[6%] pt-[95px]  md:pt-[15px]  md:pb-[60px]">
        {children}
      </main>
    </div>
  );
}
