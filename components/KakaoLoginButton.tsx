"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function KakaoLoginButton() {
  const router = useRouter();

  const handleKakaoLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_LOGIN_JAVASCRIPT_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`;
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div
      className="cursor-pointer relative w-full h-16"
      onClick={handleKakaoLogin}
    >
      <Image
        fill
        style={{ objectFit: "contain" }}
        src={"/images/kakao_login_medium_wide.png"}
        alt={"kakaologin"}
      />
    </div>
  );
}
