"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  handleKakaoCallback,
  handleKakaoLoginSession,
} from "@/app/(home)/login/actions";

export default function KakaoCallback() {
  const router = useRouter();
  const isProcessing = useRef(false); // 중복 요청 방지 상태

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) {
      alert("인증 코드가 없습니다. 다시 로그인해주세요.");
      router.replace("/login");
      return;
    }

    if (isProcessing.current) return; // 이미 요청 중이면 중단
    isProcessing.current = true;

    const processLogin = async () => {
      try {
        const result = await handleKakaoCallback(code);
        if (!result) throw new Error("Failed to handle Kakao callback");

        const { user } = result;
        await handleKakaoLoginSession(user); // 세션 처리
        router.replace("/");
      } catch (error) {
        console.error("Login error:", error);
        alert("로그인 실패. 다시 시도해주세요.");
        router.replace("/login");
      } finally {
        isProcessing.current = false; // 처리 완료 후 초기화
      }
    };

    processLogin();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>로그인 처리 중...</p>
    </div>
  );
}
