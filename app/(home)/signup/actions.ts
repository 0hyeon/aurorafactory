"use server";

import { sendAlimtalk } from "../paysuccess/actions";
import { loginFormSchema, phoneSchema, tokenSchema } from "./schema";
import { signIn } from "./services";
import crypto from "crypto";
import db from "@/lib/db";

interface ActionState {
  token: boolean;
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
  const token = formData.get("token");
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
  if (!prevState.token) {
    console.log("token");
    return { token: true };
  } else {
    // const result = await tokenSchema.spa(token); //토큰유효성검사
    // console.log("data");
  }
  // const result = await loginFormSchema.spa(data); // spa Alias of safeParseAsync

  // if (!result.success) return result.error.flatten();
  // else {
  //   await sendAlimtalk({ user_name: formData.get("username") });
  //   await signIn(result.data);
  // }
};
