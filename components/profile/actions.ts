import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// 로그아웃 - 쿠키에서 사용자 정보 제거
export const logout = async (session: any) => {
  console.log("logout");

  if (session) {
    session.destroy(); // 세션 제거
    revalidateTag("cart");
  }
  return redirect("/");
};
