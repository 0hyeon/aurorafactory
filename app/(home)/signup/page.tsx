"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import AddressSearch from "@/components/address";
import React, { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Script from "next/script";
import { createAccount } from "./actions";
import {
  TOKEN_EXPIRATION_TIME,
  initFormValue,
  initialState,
} from "./constants";
import { FormState, Istate } from "./types";

export default function LogIn() {
  const [state, setState] = useState<Istate>(initialState);
  const [form, setForm] = useState<FormState>(initFormValue);
  const [addressData, setAddressData] = useState({
    address: "",
    postaddress: "",
    detailaddress: "",
  });
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const handleNavigate = () => {
    setState((prevState: Istate) => ({
      ...prevState,
      token: false,
    }));
  };
  useEffect(() => {
    if ((state?.token && state.tokenSentAt) || timeRemaining > 0) {
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
  }, [state?.token, state?.tokenSentAt]); // timeRemaining를 의존성에서 제거

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

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

      setState((prevState: Istate) => ({
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

  useEffect(() => {
    if ((state?.token && state.tokenSentAt) || timeRemaining > 0) {
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
  }, [state?.token, state?.tokenSentAt]); // timeRemaining을 의존성에서 제거하여 리랜더링 방지

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
                  errors={state?.error?.fieldErrors?.token}
                />
                <div className="mx-auto flex gap-3">
                  <Button type="submit" text="인증하기" />
                  <Button text="뒤로가기" onClick={handleNavigate} />
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
                  errors={state?.error?.fieldErrors?.username}
                />
                <Input
                  name="phone"
                  type="text"
                  placeholder="핸드폰번호 (인증번호 전송예정)"
                  required
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  errors={state?.error?.fieldErrors?.phone}
                />
                <div className="w-0 h-px my-2" />
                <Input
                  name="email"
                  type="email"
                  placeholder="이메일"
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  errors={state?.error?.fieldErrors?.email}
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
