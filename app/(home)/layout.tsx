import Profile from "@/components/profile/page";
import Header from "./components/header";
import Link from "next/link";
import getSession from "@/lib/session";

export default async function TabLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <div>
       <div className="h-auto pt-4 gap-4 flex items-center justify-end text-[12px] max-w-[1100px] mx-auto my-0">
            {session && session ?
              <Profile />
            :
            <>
              <div><Link href="/signup">회원가입</Link></div>
              <div><Link href="/login">로그인</Link></div>
            </>
          }
      </div>
      <Header />
      {children}
    </div>
  );
}
