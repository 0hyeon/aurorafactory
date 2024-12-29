"use server";
import db from "@/lib/db";

import bcrypt from "bcrypt";
import { formSchema } from "./schemas";
import { getUserWithEmail } from "./repositories";
import getSessionCarrot, { getSession, saveLoginSession } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { IKakaoUser } from "@/types/type";
import { formatPhoneNumber } from "@/lib/utils";
import { Prisma, User } from "@prisma/client";

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  // const cookieStore = cookies();
  const session = await getSessionCarrot();
  const result = await formSchema.spa(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // 사용자를 찾았다면 암호화된 비밀번호 검사
    const user = (await getUserWithEmail(result.data.email)) as any;
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx"
    );

    if (ok) {
      await saveLoginSession(session, user!); // 로그인
    } else {
      return {
        fieldErrors: {
          password: ["비밀번호가 틀립니다."],
          email: [],
        },
      };
    }
  }
};

let usedCodes: Set<string> = new Set();
export async function fetchKakaoToken(code: string) {
  // 이미 처리된 코드인지 확인
  if (usedCodes.has(code)) {
    console.error("Kakao Token Fetch Error: Code already used");
    throw new Error("Authorization code has already been used.");
  }

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
    redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
    client_secret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET!,
    code,
  });

  const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!tokenResponse.ok) {
    const errorResponse = await tokenResponse.json();
    console.error("Kakao Token Fetch Error:", errorResponse);

    if (errorResponse.error === "invalid_grant") {
      throw new Error("Authorization code expired. Please reauthorize.");
    }

    throw new Error(errorResponse.error_description || "Failed to fetch token");
  }

  const tokenData = await tokenResponse.json();

  // 인증 코드 사용 처리
  usedCodes.add(code);

  return tokenData;
}
export async function handleKakaoCallback(code: string | null) {
  if (!code) {
    throw new Error("Authorization code is missing.");
  }

  try {
    // 토큰 요청
    const tokenData = await fetchKakaoToken(code);

    // 사용자 정보 요청
    const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error("Failed to fetch user info:", errorData);
      throw new Error(errorData.msg || "Failed to fetch user info");
    }

    const userData = await userResponse.json();
    return { user: userData };
  } catch (error: any) {
    console.error("Kakao Callback Error:", error);

    if (error.message.includes("authorization code not found")) {
      return { expired: true, message: "Authorization code expired." };
    }

    throw new Error(error.message || "Unexpected error occurred during login");
  }
}

export const updateOrCreateUser = async (user: any): Promise<User> => {
  const { id, properties, kakao_account } = user;
  console.log("user : ", user);
  // 전화번호 변환
  const formattedPhone = kakao_account.phone_number
    ? formatPhoneNumber(kakao_account.phone_number)
    : "";

  if (formattedPhone === "") {
    throw new Error("전화번호를 확인할 수 없습니다.");
  }

  // 기존 사용자 조회
  const existingUser = await db.user.findUnique({
    where: { phone: formattedPhone },
  });

  if (existingUser) {
    // 기존 사용자 업데이트
    return await db.user.update({
      where: { phone: formattedPhone },
      data: {
        username: properties.nickname,
        avatar: properties.profile_image,
        updatedAt: new Date(),
      },
    });
  } else {
    // 새 사용자 생성
    return await db.user.create({
      data: {
        username: properties.nickname,
        avatar: properties.profile_image,
        phone: formattedPhone,
        address: null,
        postaddress: null,
        detailaddress: null,
        created_at: new Date(),
        updatedAt: new Date(),
      },
    });
  }
};
export const handleKakaoLoginSession = async (user: any) => {
  try {
    const userData = await updateOrCreateUser(user);
    const cookieStore = cookies();
    const session = await getSession(cookieStore);
    session.id = userData.id;
    session.username = userData.username;
    session.phone = userData.phone;
    await session.save();

    console.log("Session saved successfully:", session);

    return userData;
  } catch (error) {
    console.error("Error in handleKakaoLogin:", error);
    throw new Error("Failed to handle Kakao login");
  }
};
