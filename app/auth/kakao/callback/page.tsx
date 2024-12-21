"use client";

import { handleKakaoCallback } from "@/app/(home)/login/actions";
import { KakaoLoginSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function KakaoCallback() {
  const router = useRouter();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    const handleLogin = async () => {
      if (code) {
        try {
          const { user, accessToken } = await handleKakaoCallback(code);
          // Access Token을 저장하거나 세션을 설정
          document.cookie = `accessToken=${accessToken}; Path=/;`;
          // console.log("User Info:", user);
          console.log("handleKakaoCallback", user);
          KakaoLoginSession(user);
          // 로그인 후 메인 페이지로 이동
          router.replace("/");
        } catch (error) {
          console.error("Login failed:", error);
          alert("로그인에 실패했습니다.");
          router.replace("/");
        }
      }
    };

    handleLogin();
  }, [router]);

  return <div>로그인 처리 중...</div>;
}
