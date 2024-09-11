"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import AddressSearch from "@/components/address";
import React, { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Script from "next/script";
import { createAccount } from "./actions";

interface FormState {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  address: string;
  postaddress: string;
  detailaddress: string;
  token: string;
}

export interface ActionResult {
  token?: boolean;
  tokenNumber?: string;
  tokenSentAt?: number;
  error?: {
    message: string;
  };
  fieldErrors?: {
    username?: string[];
    phone?: string[];
    email?: string[];
    password?: string[];
    confirm_password?: string[];
    // 필요한 필드 추가
  };
}

const initialState: ActionResult = {
  token: false,
};
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

export default function LogIn() {
  const [state, setState] = useState<ActionResult>(initialState);
  const [form, setForm] = useState<FormState>(initFormValue);
  const [addressData, setAddressData] = useState({
    address: "",
    postaddress: "",
    detailaddress: "",
  });
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (state?.token && state.tokenSentAt) {
      const TOKEN_EXPIRATION_TIME = 3 * 60 * 1000; // 3분 (밀리초)
      const calculateTimeRemaining = () => {
        const currentTime = Date.now();
        const timeElapsed = currentTime - state.tokenSentAt!;
        const timeLeft = TOKEN_EXPIRATION_TIME - timeElapsed;
        setTimeRemaining(timeLeft > 0 ? timeLeft : 0);
      };

      calculateTimeRemaining();
      const interval = setInterval(calculateTimeRemaining, 1000);

      return () => clearInterval(interval);
    }
  }, [state?.token, state?.tokenSentAt]);

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    // FormState를 FormData로 변환
    formData.append("username", form.username);
    formData.append("phone", form.phone);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("confirm_password", form.confirm_password);
    formData.append("address", addressData.address);
    formData.append("postaddress", addressData.postaddress);
    formData.append("detailaddress", addressData.detailaddress);

    if (form.token) {
      formData.append("token", form.token);
    }

    try {
      const result = await createAccount(state, formData);
      setState(result); // 결과에 따라 상태 업데이트

      if (!result.token) {
        setForm(initFormValue); // 토큰이 없으면 폼 초기화
      }
    } catch (error) {
      console.error("계정 생성 중 오류 발생:", error);
    }
  };

  const onRequestTokenHandler = () => {
    console.log("Request token with phone number:", form.phone);
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6 max-w-[600px] mx-auto mt-20 border-[1px] border-black rounded-md">
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <div className="flex flex-col gap-2 font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">
          {state?.token
            ? `인증번호를 입력해주세요. (${formatTimeRemaining(timeRemaining)})`
            : "가입을 위해 아래 양식을 채워주세요!"}
        </h2>
      </div>
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-16">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full flex flex-col gap-4">
            {state?.token ? (
              <>
                <Input
                  name="token"
                  type="text"
                  value={form.token}
                  onChange={(e) => setForm({ ...form, token: e.target.value })}
                  placeholder="인증번호를 입력해주세요. (6자리)"
                  required
                  min={100000}
                  max={999999}
                  errors={state?.error?.message ? [state.error.message] : []}
                />
                <div className="w-1/6 mx-auto">
                  <Button type="submit" text="인증하기" />
                </div>
              </>
            ) : (
              <>
                <Input
                  required
                  type="text"
                  placeholder="이름"
                  name="username"
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  minLength={3}
                  maxLength={10}
                  errors={state?.error?.message ? [state.error.message] : []}
                />
                <Input
                  name="phone"
                  type="text"
                  placeholder="핸드폰번호 (인증번호 전송예정)"
                  required
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  errors={state?.error?.message ? [state.error.message] : []}
                />
                {/* <div className="w-1/6 mx-auto">
                  <Button
                    type="button"
                    text="인증하기"
                    onClick={onRequestTokenHandler}
                  />
                </div> */}
                <div className="w-0 h-px my-2" />
                <Input
                  name="email"
                  type="email"
                  placeholder="이메일"
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  errors={state?.error?.message ? [state.error.message] : []}
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="비밀번호"
                  required
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  minLength={PASSWORD_MIN_LENGTH}
                  errors={state?.error?.message ? [state.error.message] : []}
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
                  errors={state?.error?.message ? [state.error.message] : []}
                />
                <div className="w-full gap-4 flex flex-col">
                  <AddressSearch
                    addressData={addressData}
                    setAddressData={setAddressData}
                    state={state}
                  />
                </div>
                <div className="w-1/6 mx-auto">
                  <Button type="submit" text="회원가입" />
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
