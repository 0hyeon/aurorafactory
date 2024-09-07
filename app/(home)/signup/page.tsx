"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import AddressSearch from "@/components/address";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Script from "next/script";
import { createAccount } from "./actions";
import { FormState } from "./types";
import { initFormValue } from "./constants";

export default function LogIn() {
  const [state, dispatch] = useFormState(createAccount, null);
  const onSubmitHandler = () => setForm(initFormValue);

  const [form, setForm] = useState<FormState>(initFormValue);
  const [addressData, setAddressData] = useState({
    address: "",
    postaddress: "",
    detailaddress: "",
  });
  return (
    <div className="flex flex-col gap-10 py-8 px-6 max-w-[1100px] mx-auto mt-20 border-[1px] border-black rounded-md">
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">가입을 위해 아래 양식을 채워주세요!</h2>
      </div>
      <form
        onSubmit={onSubmitHandler}
        action={dispatch}
        className="flex flex-col gap-16"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full flex flex-col gap-4">
            {state.token ? (
              <>
                <Input
                  name="token"
                  type="number"
                  value={form.token}
                  onChange={(e) => setForm({ ...form, token: e.target.value })}
                  placeholder="인증번호"
                  required
                  min={100000}
                  max={999999}
                  errors={state.error?.formErrors}
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
                  placeholder="핸드폰번호 (인증번호 발송)"
                  required
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  errors={state?.fieldErrors?.phone}
                />
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
              </>
            )}
          </div>
          <div className="w-full gap-4 flex flex-col">
            <AddressSearch
              addressData={addressData}
              setAddressData={setAddressData}
              state={state}
            />
          </div>
        </div>
        <div className="w-1/6 mx-auto">
          <Button type="submit" text="Sign Up" />
        </div>
      </form>
      {/* <SocialLogin /> */}
    </div>
  );
}
