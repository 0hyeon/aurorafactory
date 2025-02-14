"use client";

import Input from "@/components/input";
import Button from "@/components/button";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { useRouter } from "next/navigation";
import KakaoLoginButton from "@/components/KakaoLoginButton";

const LogIn = () => {
  const [state, dispatch] = useFormState(login, null);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5 md:gap-10 py-8 px-6 max-w-[600px] mx-auto border-[1px] border-black rounded-md mt-5 md:mt-0">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">이메일과 비밀번호를 입력하세요.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="이메일"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          errors={state?.fieldErrors.password}
        />
        <Button type="submit" text="로그인"></Button>
      </form>

      <SocialLogin />
      <div className="w-full h-px bg-neutral-500" />
      <div className="flex flex-col gap-3">
        <KakaoLoginButton />
      </div>
      <div className="w-full h-px bg-neutral-500" />
      <Button text="뒤로가기" onClick={() => router.back()}></Button>
    </div>
  );
};

export default LogIn;
