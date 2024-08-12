import { Inter } from "next/font/google";
import Header from "./components/header/page";
import LeftMenu from "./components/leftmenu/page";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <Header />
        <LeftMenu />
        <div className="pt-12 pl-52">{children}</div>
      </body>
    </html>
  );
}
