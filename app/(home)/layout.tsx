import Profile from "@/components/profile/page";
import Header from "./components/header";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSession, getUserProfile } from "@/lib/session";
import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function TabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const user = await getUserProfile(session);
  async function getUser() {
    const session = await getSession();
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
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div>
      <div className="h-auto pt-4 gap-4 flex items-center justify-end text-[12px] max-w-[1100px] mx-auto my-0">
        {session.id ? (
          <>
            <Suspense fallback={"Hello!"}>
              {/* @ts-expect-error Async Server Component */}
              <Username />
            </Suspense>
            <form action={logOut}>
              <button>로그아웃</button>
            </form>
            {/* <Profile user={user} /> */}
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
      <Header cookies={session.id} />
      <div className="w-full max-w-[1100px] mx-auto">
        <div className="pt-[60px] pb-[60px]">{children}</div>
      </div>
    </div>
  );
}
