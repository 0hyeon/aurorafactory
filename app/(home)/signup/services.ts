import bcrypt from "bcrypt";

import { z } from "zod";
import { getSession } from "@/lib/session";
import {
  createUser,
  getUserIdWithEmail,
  getUserIdWithPhone,
} from "./repositories";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const signIn = async (data: any) => {
  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 데이터베이스에 사용자 정보 저장
  const user = await createUser(data, hashedPassword);
  const cookieStore = cookies();
  const session = await getSession(cookieStore);
  session.id = user.id;
  session.phone = user.phone;
  session.address = user.address! + user.detailaddress!;
  await session.save();

  redirect("/");
};

export const isExistUser = async (
  data: any,
  ctx: z.RefinementCtx,
  flag: "email" | "phone"
) => {
  const user =
    flag === "email"
      ? await getUserIdWithEmail(data.email)
      : await getUserIdWithPhone(data.phone);

  if (user) {
    ctx.addIssue({
      code: "custom",
      message:
        flag === "email"
          ? "해당 이메일로 가입된 회원이 이미 존재합니다."
          : "해당 번호로 가입된 회원이 존재합니다.",
      path: [flag === "email" ? "email" : "username"],
      fatal: true, // 이슈 발생 시 다음 유효성 검사 실행 안 함
    });
  }
};
