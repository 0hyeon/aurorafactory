"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { lostUserIdAction } from "../actions";
import { TOKEN_EXPIRATION_TIME } from "../../signup/constants";
import { FormState, Istate } from "../../signup/types";
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

const LostUserID = () => {
  const [form, setForm] = useState<FormState>(initFormValue);
  const [state, setState] = useState<Istate>(initialState);

  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (state?.token && !state?.resultId && timeRemaining > 0) {
      const calculateTimeRemaining = () => {
        const currentTime = Date.now();
        const timeElapsed = currentTime - state.tokenSentAt!;
        const timeLeft = TOKEN_EXPIRATION_TIME - timeElapsed;
        setTimeRemaining(timeLeft > 0 ? timeLeft : 0);
      };

      const interval = setInterval(calculateTimeRemaining, 1000);

      return () => clearInterval(interval);
    } else if (state?.token && state?.resultId) {
      // token과 resultId가 모두 존재하면 타이머를 정지
      setTimeRemaining(0); // 타이머를 0으로 설정
    }
  }, [state?.token, state?.tokenSentAt, state?.resultId]); // resultId 추가

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

    if (form.token) {
      formData.append("token", form.token);
    }

    try {
      const result = await lostUserIdAction(state, formData);

      setState((prevState: any) => ({
        ...prevState,
        ...result,
        tokenSentAt: result.tokenSentAt || prevState.tokenSentAt, // 인증번호가 틀렸을 경우 tokenSentAt 갱신 방지
      }));

      if (result.token) {
        console.log("result.token : ", result.token);
      }
    } catch (error) {
      console.error("계정 생성 중 오류 발생:", error);
    }
  };
  console.log("state : ", state);
  return (
    <div className="flex flex-col gap-10 py-8 px-6 max-w-[600px] mx-auto border-[1px] border-black rounded-md">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">
          {state?.token
            ? state.resultId
              ? `해당번호로 가입된 이메일입니다. `
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
              state?.resultId ? (
                <Input
                  name="email"
                  type="text"
                  value={state.resultId.email}
                  readOnly={true}
                />
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
                    name="phone"
                    type="text"
                    placeholder="핸드폰번호 (인증번호 전송예정)"
                    required
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    errors={state?.error?.fieldErrors?.phone}
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

export default LostUserID;
