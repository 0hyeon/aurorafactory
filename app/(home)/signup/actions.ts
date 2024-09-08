"use server";

import { sendAlimtalk } from "../paysuccess/actions";
import { loginFormSchema, signTokenSchema } from "./schema";
import { signIn } from "./services";
import crypto from "crypto";
import db from "@/lib/db";
import { redirect } from "next/navigation";

interface ActionState {
  token: boolean;
  tokenSentAt: any;
  tokenNumber: any;
}
// export async function smsLogin(prevState: ActionState, formData: FormData) {
//   const phone = formData.get("phone");
//   const token = formData.get("token");
//   console.log(phone, token);
//   /*phone*/
//   if (!prevState.token) {
//     /*phone validate*/
//     const result = phoneSchema.safeParse(phone);
//     if (!result.success) {
//       return {
//         token: false,
//         error: result.error.flatten(),
//       };
//     } else {
//       //phone validate통과

//       //기존 delete previos token
//       await db.sMSToken.deleteMany({
//         where: {
//           user: {
//             phone: result.data,
//           },
//         },
//       });
//       //create token
//       const token = await getToken();
//       await db.sMSToken.create({
//         data: {
//           token,
//           //user가없더라도 sMSToken에서 user생성
//           user: {
//             connectOrCreate: {
//               where: {
//                 //user 있고 맵핑
//                 phone: result.data,
//               },
//               create: {
//                 //user가 아예없어서 등록할때
//                 username: crypto.randomBytes(10).toString("hex"),
//                 phone: result.data,
//               },
//             },
//           },
//         },
//       });
//       //send the token using twilio
//       return { token: true };
//     }
//   } else {
//     /*token*/
//     const result = await tokenSchema.spa(token); //토큰유효성검사
//     if (!result.success) {
//       return { token: !result.success, error: result.error.flatten() };
//     } else {
//       //토큰통과

//       //토큰맵핑해서찾음
//       const token = await db.sMSToken.findUnique({
//         where: {
//           token: result.data.toString(),
//         },
//         select: {
//           id: true,
//           userId: true,
//         },
//       });
//       const session = await getSession();
//       session.id = token!.userId;
//       await session.save();
//       await db.sMSToken.delete({
//         where: {
//           id: token!.id,
//         },
//       });
//       //log the user in
//       redirect("/profile");
//     }
//   }
// }

export const createAccount = async (
  prevState: ActionState,
  formData: FormData
) => {
  console.log("formData : ", formData);
  console.log("prevState : ", prevState);

  // 유저가 입력한 데이터
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    address: formData.get("address"),
    postaddress: formData.get("postaddress"),
    detailaddress: formData.get("detailaddress"),
  };

  // 토큰 발송 시간 설정
  const TOKEN_EXPIRATION_TIME = 3 * 60 * 1000; // 3분 (밀리초)

  const resultData = await loginFormSchema.spa(data); // 유효성검사 + 중복 db 찾기
  if (!prevState.token) {
    // 회원가입 영역
    if (!resultData.success) return resultData.error.flatten();

    // 토큰 생성
    const tokenNumber = await getTokenSignUp();

    // 인증 토큰 발송 (핸드폰 번호와 함께)
    await sendAlimtalk({ user_name: tokenNumber });

    // 토큰 발송 시간 기록
    const tokenSentAt = Date.now();

    // 토큰과 발송 시간을 prevState에 저장
    return {
      token: true,
      tokenNumber, // 생성한 토큰 저장
      tokenSentAt, // 토큰 발송 시간 저장
    };
  } else {
    // 인증 토큰 입력 받는 부분
    const token = formData.get("token");

    // 발송 후 3분이 초과되었는지 체크
    const currentTime = Date.now();
    const timeElapsed = currentTime - prevState.tokenSentAt;

    if (timeElapsed > TOKEN_EXPIRATION_TIME) {
      return {
        token: false,
        error: { message: "인증 시간이 초과하였습니다." },
      };
    }

    // 토큰 유효성 검사
    const result = await signTokenSchema.spa(Number(token));
    if (!result.success) return result.error.flatten();

    console.log("token : ", token);
    console.log("result.data : ", result.data);

    // 저장된 토큰과 입력한 토큰 비교
    if (prevState.tokenNumber === String(result.data)) {
      // 인증 성공 시 회원 정보 저장
      await signIn(resultData.data);
      await sendAlimtalk({ user_name: formData.get("username") });
      return redirect("/login");
    } else {
      // 토큰 불일치
      return {
        token: false,
        error: { message: "인증번호가 일치하지 않습니다." },
      };
    }
  }
};
async function getTokenSignUp() {
  const token = crypto.randomInt(100000, 999999).toString();
  return token;
}
