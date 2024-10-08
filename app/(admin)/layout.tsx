import { Inter } from "next/font/google";
import Header from "./components/header/page";
import LeftMenu from "./components/leftmenu/page";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import React, { ReactElement } from "react";
const inter = Inter({ subsets: ["latin"] });

interface ChildProps {
  showAlert: boolean;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactElement<ChildProps>;
}>) {
  const cookieStore = cookies();
  const session = await getSession(cookieStore);

  // 만약 세션이 없으면 로그인 페이지로 리디렉션
  const showAlert = session.id === 3;
  if (!session?.id) {
    redirect("/login");
  }
  if (!showAlert) {
    redirect("/");
  }
  return (
    <html lang="en">
      {showAlert ? (
        <body className={`${inter.className} `}>
          <Header />
          <LeftMenu />
          <div className="pt-12 pl-52">
            {React.isValidElement(children)
              ? React.cloneElement(children, { showAlert })
              : children}
          </div>
        </body>
      ) : (
        ""
      )}
    </html>
  );
}
