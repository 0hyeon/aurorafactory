"use server";

import bcrypt from "bcrypt";
import { formSchema } from "./schemas";
import { getUserWithEmail } from "./repositories";
import getSessionCarrot, { getSession, saveLoginSession } from "@/lib/session";
import { cookies } from "next/headers";

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

export async function fetchKakaoToken(code: string) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
    redirect_uri: process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URL!,
    client_secret: process.env.NEXT_PUBLIC_KAKAO_LOGIN_CLIENT_KEY!,
    code,
  });

  console.log("Kakao Token Request Params:", params.toString());

  const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!tokenResponse.ok) {
    const errorResponse = await tokenResponse.json();
    console.error("Kakao Token Fetch Error:", errorResponse);
    throw new Error(errorResponse.error_description || "Failed to fetch token");
  }

  const tokenData = await tokenResponse.json();
  console.log("Kakao Token Data:", tokenData);
  return tokenData;
}

export async function handleKakaoCallback(code: string) {
  try {
    const tokenData = await fetchKakaoToken(code);

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
    return {
      accessToken: tokenData.access_token,
      user: userData,
    };
  } catch (error: any) {
    console.error("Kakao Callback Error:", error);
    throw new Error(error.message || "Kakao login failed.");
  }
}
