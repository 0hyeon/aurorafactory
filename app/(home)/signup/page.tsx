"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import AddressSearch from "@/components/address";
import React, { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Script from "next/script";
import { createAccount } from "./actions";
import { FormState } from "./types";
import { initFormValue } from "./constants";

export default function LogIn() {
  const [state, dispatch] = useFormState(createAccount, initFormValue);
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
        const timeElapsed = currentTime - state.tokenSentAt;
        const timeLeft = TOKEN_EXPIRATION_TIME - timeElapsed;
        if (timeLeft <= 0) {
          setTimeRemaining(0);
        } else {
          setTimeRemaining(timeLeft);
        }
      };

      calculateTimeRemaining(); // 초기 값 설정
      const interval = setInterval(() => {
        calculateTimeRemaining();
      }, 1000);

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 클리어
    }
  }, [state?.token, state.tokenSentAt]);

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    // FormState를 FormData로 변환
    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("phone", form.phone);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("confirm_password", form.confirm_password);
    formData.append("address", addressData.address);
    formData.append("postaddress", addressData.postaddress);
    formData.append("detailaddress", addressData.detailaddress);

    if (form.token) {
      formData.append("token", form.token); // token이 있는 경우
    }

    dispatch(formData); // FormData 전달

    // 인증번호 입력 상태가 아니라면 폼 초기화
    if (!state?.token) {
      setForm(initFormValue); // 폼 초기화
    }
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6 max-w-[600px] mx-auto mt-20 border-[1px] border-black rounded-md">
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <div className="flex flex-col gap-2 *:font-medium">
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
                  errors={state?.fieldErrors?.token}
                />
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
                  errors={state?.fieldErrors?.username}
                />
                <Input
                  name="phone"
                  type="text"
                  placeholder="핸드폰번호 (인증번호 전송예정)"
                  required
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  errors={state?.fieldErrors?.phone}
                />
                <div className="w-0 h-px my-2" />
                <Input
                  name="email"
                  type="email"
                  placeholder="이메일"
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  errors={state?.fieldErrors?.email}
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
                  errors={state?.fieldErrors?.password}
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
                  errors={state?.fieldErrors?.confirm_password}
                />
                <div className="w-full gap-4 flex flex-col">
                  <AddressSearch
                    addressData={addressData}
                    setAddressData={setAddressData}
                    state={state}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-1/6 mx-auto">
          <Button
            type="submit"
            text={`${state?.token ? "인증하기" : "회원가입"}`}
          />
        </div>
      </form>
      {/* <SocialLogin /> */}
    </div>
  );
}
