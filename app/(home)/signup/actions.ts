"use server";

import { sendAlimtalk } from "../paysuccess/actions";
import { FlattenedError, loginFormSchema, signTokenSchema } from "./schema";
import { signIn } from "./services";
import crypto from "crypto";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { ActionResult } from "./page";

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
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
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
      const errors: FlattenedError = resultData.error.flatten();

      return {
        token: false,
        error: {
          message: errors.formErrors.join(", ") || "Unknown error occurred",
        },
      };
    }
    const tokenNumber = await getTokenSignUp();

    await sendAlimtalk({ user_name: tokenNumber });
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
        token: false,
        error: { message: "인증 시간이 초과하였습니다." },
      };
    }

    const result = await signTokenSchema.spa(Number(token));
    if (!result.success) {
      const errors = result.error.flatten(); // 타입 자동 추론

      return {
        error: {
          // formErrors 또는 fieldErrors에서 에러 메시지 추출
          message: errors.formErrors.join(", ") || "Unknown error occurred",
        },
      };
    }

    if (prevState.tokenNumber === String(result.data)) {
      await signIn(resultData.data);
      await sendAlimtalk({ user_name: formData.get("username") });
      return redirect("/login");
    } else {
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
