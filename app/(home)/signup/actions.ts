"use server";

import { sendAlimtalk } from "../paysuccess/actions";
import { loginFormSchema, signTokenSchema } from "./schema";
import { signIn } from "./services";
import crypto from "crypto";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import twilio from "twilio";

export const createAccount = async (
  prevState: any,
  formData: FormData
): Promise<any> => {
  const data = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
    address: formData.get("address") as string,
    postaddress: formData.get("postaddress") as string,
    detailaddress: formData.get("detailaddress") as string,
  };

  const TOKEN_EXPIRATION_TIME = 3 * 60 * 1000;

  function formatPhoneNumberToE164(phone: string) {
    if (phone.startsWith("010")) {
      return "+82" + phone.slice(1);
    } else {
      throw new Error("Invalid phone number format. It should start with 010.");
    }
  }

  const resultData = await loginFormSchema.spa(data);
  if (!prevState.token) {
    if (!resultData.success) {
      return {
        token: resultData.success,
        error: resultData.error.flatten(),
      };
    }
    const tokenNumber = await getTokenSignUp();

    //await sendAlimtalk({ user_name: tokenNumber });
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    client.messages.create({
      body: `인증번호를 입력해주세요.  ${tokenNumber}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: formatPhoneNumberToE164(data.phone),
    });

    return {
      token: true,
      tokenNumber,
      tokenSentAt: Date.now(),
    };
  } else {
    const token = formData.get("token");

    const currentTime = Date.now();
    const timeElapsed = currentTime - (prevState.tokenSentAt ?? 0);
    if (timeElapsed > TOKEN_EXPIRATION_TIME) {
      return {
        token: true,
        error: { fieldErrors: { token: ["인증 시간이 초과하였습니다."] } },
      };
    }

    const result = await signTokenSchema.spa({ token: Number(token) });
    if (!result.success) {
      return {
        token: true,
        error: result.error?.flatten(),
      };
    }

    if (prevState.tokenNumber === String(result.data.token)) {
      await signIn(resultData.data);
      //await sendAlimtalk({ user_name: formData.get("username") });
      return redirect("/login");
    } else {
      return {
        token: true,
        error: { fieldErrors: { token: ["인증번호가 일치하지 않습니다."] } },
      };
    }
  }
};
export async function getTokenSignUp() {
  const token = crypto.randomInt(100000, 999999).toString();
  return token;
}
