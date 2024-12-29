"use server";

import { passwordFindSchema, phoneSchema, psswordSetSchema } from "./schemas";
import { getUserWithPhone, updateUser } from "./repositories";
import db from "@/lib/db";
import { signTokenSchema } from "../signup/schema";
import crypto from "crypto";
import { sendTwilioMesage } from "./services";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { sendMessageAligo } from "../signup/actions";
export const lostUserPwAction = async (
  prevState: any,
  formData: FormData
): Promise<any> => {
  const data = {
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
  };

  const TOKEN_EXPIRATION_TIME = 3 * 60 * 1000;

  const resultData = await passwordFindSchema.spa(data);

  if (prevState.token && prevState.passWordSet) {
    // 비밀번호 유효성검사
    const result = await psswordSetSchema.spa(data);
    console.log("result2 : ", result);
    if (!result.success) {
      //토근틀릴시
      return {
        token: true,
        error: result.error?.flatten(),
      };
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 12);
      await updateUser({ data, hashedPassword });
      redirect("/");
    }
  } else if (!prevState.token) {
    // 번호입력시

    console.log("pw resultData : ", resultData);
    if (!resultData.success) {
      // 실패시
      return {
        token: resultData.success,
        error: resultData.error.flatten(),
      };
    }
    // resultData.data가 현재 등록된건지 확인

    // 기존 토큰삭제
    await db.sMSToken.deleteMany({
      where: {
        user: {
          phone: data.phone,
        },
      },
    });
    //create token
    const tokenNumber = await getTokenSignUp();
    console.log("tokenNumber : ", tokenNumber);
    // 토큰 connect
    await db.sMSToken.create({
      data: {
        token: tokenNumber,
        //user가없더라도 sMSToken에서 user생성
        user: {
          connect: {
            phone: data.phone,
          },
        },
      },
    });

    // 문자발송 aligo
    //await sendAlimtalk({ user_name: tokenNumber });

    // 문자발송 twilio
    // await sendTwilioMesage({ tokenNumber, phone: data.phone });

    // 문자발송 aligo
    await sendMessageAligo({
      receiver: data.phone,
      msg: `인증번호를 입력해주세요.  ${tokenNumber}`,
    });

    return {
      token: true,
      tokenNumber,
      tokenSentAt: Date.now(),
    };
  } else if (prevState.token) {
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
      //토큰서치
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.token.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      //토큰삭제
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      //await sendAlimtalk({ user_name: formData.get("username") });
      return { token: true, passWordSet: true };
    } else {
      return {
        token: true,
        error: { fieldErrors: { token: ["인증번호가 일치하지 않습니다."] } },
      };
    }
  }
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

  const resultData = await phoneSchema.spa(data);
  if (!prevState.token) {
    // 번호입력시

    console.log("resultDataID : ", resultData); //resultData :  { success: true, data: '0104109659' }
    if (!resultData.success) {
      // 실패시
      return {
        token: resultData.success,
        error: resultData.error.flatten(),
      };
    }
    // resultData.data가 현재 등록된건지 확인

    // 기존 토큰삭제
    await db.sMSToken.deleteMany({
      where: {
        user: {
          phone: data.phone,
        },
      },
    });
    //create token
    const tokenNumber = await getTokenSignUp();

    // 토큰 connect
    await db.sMSToken.create({
      data: {
        token: tokenNumber,
        //user가없더라도 sMSToken에서 user생성
        user: {
          connect: {
            phone: data.phone,
          },
        },
      },
    });

    // 문자발송 aligo
    //await sendAlimtalk({ user_name: tokenNumber });

    // 문자발송 twilio
    // await sendTwilioMesage({ tokenNumber, phone: data.phone });

    // 문자발송 aligo
    await sendMessageAligo({
      receiver: data.phone,
      msg: `인증번호를 입력해주세요.  ${tokenNumber}`,
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
      //토큰서치
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.token.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      //토큰삭제
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });

      const resultId = await getUserWithPhone(data.phone);
      //await sendAlimtalk({ user_name: formData.get("username") });
      return { token: true, resultId };
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
