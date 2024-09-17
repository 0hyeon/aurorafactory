"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { lostUserPwAction } from "../actions";
import { TOKEN_EXPIRATION_TIME } from "../../signup/constants";
import { FormState, Istate } from "../../signup/types";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
const initFormValue: FormState = {
  username: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  address: "",
  postaddress: "",
  detailaddress: "",
  token: "",
};
const initialState = {
  token: false,
};

const LostUserPW = () => {
  const [form, setForm] = useState<FormState>(initFormValue);
  const [state, setState] = useState<Istate>(initialState);

  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (state?.token && !state?.passWordSet) {
      const calculateTimeRemaining = () => {
        if (state.tokenSentAt) {
          const currentTime = Date.now();
          const timeElapsed = currentTime - state.tokenSentAt;
          const timeLeft = TOKEN_EXPIRATION_TIME - timeElapsed;
          setTimeRemaining(timeLeft > 0 ? timeLeft : 0);
        }
      };

      calculateTimeRemaining(); // 타이머가 시작될 때 바로 계산 실행
      const interval = setInterval(calculateTimeRemaining, 1000);

      return () => clearInterval(interval);
    } else if (state?.token && state?.passWordSet) {
      // token과 passWordSet가 모두 존재하면 타이머를 정지
      setTimeRemaining(0); // 타이머를 0으로 설정
      console.log("state : ", state);
    }
  }, [state?.token, state?.tokenSentAt, state?.passWordSet]);

  const formatTimeRemaining = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    formData.append("phone", form.phone);
    formData.append("email", form.email);

    formData.append("password", form.password);
    formData.append("confirm_password", form.confirm_password);

    if (form.token) {
      formData.append("token", form.token);
    }

    try {
      const result = await lostUserPwAction(state, formData);

      setState((prevState: any) => ({
        ...prevState,
        ...result,
        tokenSentAt: result.tokenSentAt || prevState.tokenSentAt, // 인증번호가 틀렸을 경우 tokenSentAt 갱신 방지
      }));
    } catch (error) {
      console.error("계정 생성 중 오류 발생:", error);
    }
  };
  return (
    <div className="flex flex-col gap-10 py-8 px-6 max-w-[600px] mx-auto border-[1px] border-black rounded-md">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">
          {state?.token
            ? state.passWordSet
              ? `새로운 비밀번호를 입력하세요. `
              : `인증번호를 입력해주세요. (${formatTimeRemaining(
                  timeRemaining
                )})`
            : "인증번호 받으실 핸드폰 번호를 입력하세요."}
        </h2>
      </div>
      <form onSubmit={onSubmitHandler} className="flex flex-col">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full flex flex-col gap-4">
            {state?.token ? (
              state?.passWordSet ? (
                <>
                  <Input
                    name="password"
                    type="password"
                    placeholder="새로운 비밀번호"
                    required
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    minLength={PASSWORD_MIN_LENGTH}
                    errors={state?.error?.fieldErrors?.password}
                  />
                  <Input
                    name="confirm_password"
                    type="password"
                    placeholder="비밀번호 확인"
                    required
                    onChange={(e) =>
                      setForm({ ...form, confirm_password: e.target.value })
                    }
                    minLength={PASSWORD_MIN_LENGTH}
                    errors={state?.error?.fieldErrors?.confirm_password}
                  />
                  <div className="flex gap-3">
                    <Button type="submit" text="저장" />
                  </div>
                </>
              ) : (
                <>
                  <Input
                    name="token"
                    type="text"
                    value={form.token}
                    onChange={(e) =>
                      setForm({ ...form, token: e.target.value })
                    }
                    placeholder="인증번호를 입력해주세요. (6자리)"
                    required
                    min={100000}
                    max={999999}
                    errors={state?.error?.fieldErrors?.token}
                  />
                  <div className="flex gap-3">
                    <Button type="submit" text="인증번호발송" />
                  </div>
                </>
              )
            ) : (
              <>
                <div className="gap-4 flex flex-col">
                  <Input
                    name="email"
                    type="email"
                    placeholder="이메일주소"
                    required
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    errors={state?.error?.fieldErrors?.email}
                  />
                  <Input
                    name="phone"
                    type="text"
                    placeholder="핸드폰번호 (인증번호 전송예정)"
                    required
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    errors={
                      state?.error?.formErrors.length !== 0
                        ? state?.error?.formErrors
                        : state?.error?.fieldErrors.phone
                    }
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" text="인증번호발송" />
                </div>
              </>
            )}
          </div>
        </div>
      </form>
      <div className="w-full h-px bg-neutral-500" />
      <Button text="뒤로가기" onClick={() => router.back()}></Button>
    </div>
  );
};

export default LostUserPW;
