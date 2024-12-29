"use client";

import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function KakaoLoginButton() {
  const router = useRouter();

  const handleKakaoLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_LOGIN_JAVASCRIPT_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* GitHub Login */}
      {/* <button className="w-full max-w-md px-6 py-3 bg-gray-800 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-900 transition duration-200">
        Continue with GitHub
      </button> */}
      <div
        className="cursor-pointer w-full max-w-md relative h-12"
        onClick={handleKakaoLogin}
      >
        <Image
          fill
          style={{ objectFit: "contain" }}
          src={"/images/kakao_login_medium_wide.png"}
          alt={"Kakao Login"}
        />
      </div>
    </div>
  );
}
