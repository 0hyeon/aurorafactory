"use client";

import {
  handleKakaoCallback,
  KakaoLoginSession,
} from "@/app/(home)/login/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function KakaoCallback() {
  const router = useRouter();
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  const handleLoginRedirect = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`;
    window.location.href = KAKAO_AUTH_URL;
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      handleLoginRedirect();
      return;
    }

    if (hasAttemptedLogin) return;

    const handleLogin = async () => {
      setHasAttemptedLogin(true);

      try {
        const result = await handleKakaoCallback(code);
        if (!result) throw new Error("Login failed");

        const { user, accessToken } = result;
        await KakaoLoginSession(user);
        router.replace("/");
      } catch (error) {
        console.error("Login failed:", error);
        alert("인증이 만료되었습니다. 다시 로그인해주세요.");
        handleLoginRedirect();
      }
    };

    handleLogin();
  }, [hasAttemptedLogin, router]);

  return <div>로그인 처리 중...</div>;
}
