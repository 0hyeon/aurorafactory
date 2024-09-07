"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormState } from "react-dom";
import { findUserToken } from "../actions";
const LostUserID = () => {
  const [state, dispatch] = useFormState(findUserToken, null);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-10 py-8 px-6 max-w-[600px] mx-auto border-[1px] border-black rounded-md">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">이메일과 비밀번호를 입력하세요.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="name"
          type="text"
          placeholder="이름"
          required
          errors={state?.fieldErrors.username}
        />
        <Input
          name="phoneNumber"
          type="phoneNumber"
          placeholder="핸드폰번호"
          required
          errors={state?.fieldErrors.phone}
        />
        <Button type="submit" text="로그인"></Button>
      </form>
      <div className="w-full h-px bg-neutral-500" />
      <Button text="뒤로가기" onClick={() => router.back()}></Button>
    </div>
  );
};

export default LostUserID;
