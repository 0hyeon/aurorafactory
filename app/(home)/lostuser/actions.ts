"use server";

import { userFormSchema } from "./schemas";
import { getUserWithEmail, getUserWithPhone } from "./repositories";
import { getSession, saveLoginSession } from "@/lib/session";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { phoneSchema, signTokenSchema } from "../signup/schema";
import twilio from "twilio";
import crypto from "crypto";
export const getUserIdWithPhone = async (phone: string) => {
  const result = await db.user.findFirst({
    where: { phone },
    select: { id: true },
  });

  return { token: true };
};

export const lostUserIdAction = async (
  prevState: any,
  formData: FormData
): Promise<any> => {
  const data = {
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
  };

  const TOKEN_EXPIRATION_TIME = 3 * 60 * 1000;

  function formatPhoneNumberToE164(phone: string) {
    if (phone.startsWith("010")) {
      return "+82" + phone.slice(1);
    } else {
      throw new Error("Invalid phone number format. It should start with 010.");
    }
  }

  const resultData = await phoneSchema.spa(data.phone);
  console.log("resultData : ", resultData);
  if (!prevState.token) {
    //번호입력시
    if (!resultData.success) {
      //실패시
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
    //토큰입력시
    const token = formData.get("token");

    const currentTime = Date.now();
    const timeElapsed = currentTime - (prevState.tokenSentAt ?? 0);
    if (timeElapsed > TOKEN_EXPIRATION_TIME) {
      //시간초과시
      return {
        token: true,
        error: { fieldErrors: { token: ["인증 시간이 초과하였습니다."] } },
      };
    }

    const result = await signTokenSchema.spa({ token: Number(token) });
    if (!result.success) {
      //토근틀릴시
      return {
        token: true,
        error: result.error?.flatten(),
      };
    }
    //일치시
    if (prevState.tokenNumber === String(result.data.token)) {
      const resultId = await getUserWithPhone(data.phone);
      //await sendAlimtalk({ user_name: formData.get("username") });
      return { resultId };
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
