"use server";

import bcrypt from "bcrypt";
import { userFormSchema } from "./schemas";
import { getUserWithEmail } from "./repositories";
import { getSession, saveLoginSession } from "@/lib/session";
import { cookies } from "next/headers";

export const findUserToken = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get("username"),
    phone: formData.get("phone"),
  };
  const cookieStore = cookies();
  const session = await getSession(cookieStore);
  const result = await userFormSchema.spa(data);
  console.log("result :", result);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // 사용자를 찾았다면 암호화된 비밀번호 검사
    // const user = await getUserWithEmail(result.data.email);
    // const ok = await bcrypt.compare(
    //   result.data.password,
    //   user!.password ?? "xxxx"
    // );
    // if (ok) {
    //   await saveLoginSession(session, user!); // 로그인
    // } else {
    //   return {
    //     fieldErrors: {
    //       password: ["비밀번호가 틀립니다."],
    //       email: [],
    //     },
    //   };
    // }
  }
};
