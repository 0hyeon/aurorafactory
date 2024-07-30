"use server";
import Profile from "@/components/profile/page";
import Header from "./components/header";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSession, getUserProfile } from "@/lib/session";
import LogoutButton from "@/components/profile/components/LogoutButton";

export default async function TabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const session = await getSession(cookieStore);
  const user = await getUserProfile(session);

  return (
    <div>
      <div className="h-auto pt-4 gap-4 flex items-center justify-end text-[12px] max-w-[1100px] mx-auto my-0">
        {session.id ? (
          <>
            <Profile user={user} />
            |<LogoutButton />
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
