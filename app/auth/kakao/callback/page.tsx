"use client";

import { handleKakaoCallback } from "@/app/(home)/login/actions";
import { KakaoLoginSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function KakaoCallback() {
  const router = useRouter();
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code || hasAttemptedLogin) return;

    const handleLogin = async () => {
      setHasAttemptedLogin(true);

      try {
        const result = await handleKakaoCallback(code);
        if (!result) return;

        const { user, accessToken } = result;
        document.cookie = `accessToken=${accessToken}; Path=/;`;
        console.log("user : ", user);
        console.log("user.properties.nickname : ", user.properties.nickname);

        KakaoLoginSession(user);
        router.replace("/");
      } catch (error) {
        console.error("Login failed:", error);
        alert("인증이 만료되었습니다. 다시 로그인해주세요.");
        router.replace("/login");
      }
    };

    handleLogin();
  }, [hasAttemptedLogin, router]);

  return <div>로그인 처리 중...</div>;
}
