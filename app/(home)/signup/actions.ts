"use server";

import { sendAlimtalk } from "../paysuccess/actions";
import { loginFormSchema, signTokenSchema } from "./schema";
import { signIn } from "./services";
import crypto from "crypto";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { ActionResult } from "./page";

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
    console.log(tokenNumber);
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
      console.log("4");
      return {
        token: true,
        error: result.error?.flatten(),
      };
    }

    if (prevState.tokenNumber === String(result.data)) {
      await signIn(resultData.data);
      //await sendAlimtalk({ user_name: formData.get("username") });
      return redirect("/login");
    } else {
      console.log("5");
      return {
        token: true,
        error: { fieldErrors: { token: ["인증번호가 일치하지 않습니다."] } },
      };
    }
  }
};
async function getTokenSignUp() {
  const token = crypto.randomInt(100000, 999999).toString();
  return token;
}
