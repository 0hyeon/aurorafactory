'use client';

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import React from "react";
import { useFormState } from "react-dom";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Script from 'next/script'
import AddressSearch from "@/components/address";
import { SignUpType, loginFormSchema } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccount } from "./actions";

export default function LogIn() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<SignUpType>({
    resolver: zodResolver(loginFormSchema),
  });
  console.log("errors  :",errors)

  
  const onSubmit = handleSubmit(async (data) => {
    console.log("data :",data)
    const formData = new FormData();
    formData.append("username", data.username)
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("confirm_password", data.confirm_password)
    formData.append("address", data.address)
    formData.append("postaddress", data.postaddress)
    formData.append("detailaddress", data.detailaddress)

    const errors = await createAccount(formData);

    if (errors) {
      console.log("errors : ",errors)
    }else {
      // If all async operations complete successfully, refresh the page
      window.location.reload();
    }

  });
  const onValid = async (e:any) => {
    e.preventDefault();  
    await onSubmit();
  };
  return (
    <div className="flex flex-col gap-10 py-8 px-6 max-w-[1100px] mx-auto mt-20 border-[1px] border-black rounded-md">
       <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <div className="flex flex-col gap-2 *:font-medium">
        <h2 className="text-xl">Log In with email and password.</h2>
      </div>
      <form onSubmit={onValid} className="flex flex-col gap-6">
        <div className="flex *:p-5">
          <div className="w-1/2 gap-4 flex flex-col">
            <Input
              required
              type="text"
              placeholder="이름"
              {...register("username")}
              minLength={3}
              maxLength={10}
              errors={[errors.username?.message ?? ""]}
            />
            <Input
              {...register("email")}
              type="email"
              placeholder="이메일"
              required
              errors={[errors.email?.message ?? ""]}
              
            />
            <Input
              {...register("password")}
              type="password"
              placeholder="비밀번호"
              required
              minLength={PASSWORD_MIN_LENGTH}
              errors={[errors.password?.message ?? ""]}
            />
            <Input
              {...register("confirm_password")}
              type="password"
              placeholder="비밀번호 확인"
              required
              minLength={PASSWORD_MIN_LENGTH}
              errors={[errors.confirm_password?.message ?? ""]}
            />
          </div>
          <div className="w-1/2 gap-4 flex flex-col">
            <AddressSearch register={register} setValue={setValue} errors={errors} />
          </div>
        </div>
        <div className="w-1/6 mx-auto">
          <Button type="submit" text="Sign Up"  />
        </div>
      </form>
      <SocialLogin />
    </div>
  );
}
