import { ALIGO_SEND_API, COMPANY, SIGN_UP_TEMPLATES } from "@/lib/constants";

interface ChannelAuthResponse {
  result: string;
  code: string;
  message: string;
  info?: any; // Replace 'any' with the appropriate type based on your expected response
}

export async function authAligoToken() {
  const basicSendUrl = "https://kakaoapi.aligo.in/akv10/profile/auth/";

  const smsData = {
    apikey: process.env.KAKAO_API_KEY ?? "", // API key from env
    userid: process.env.ALIGO_USER_ID ?? "", // Aligo site user ID from env
    plusid: process.env.KAKAO_PLUS_ID ?? "", // Kakao channel ID (with @) from env
    phonenumber: process.env.ADMIN_PHONE_NUMBER ?? "", // Admin phone number from env
  };
  console.log("smsData : ", smsData);

  // Check if all required environment variables are set
  if (
    !smsData.apikey ||
    !smsData.userid ||
    !smsData.plusid ||
    !smsData.phonenumber
  ) {
    console.error("Environment variables are missing.");
    return {
      result: "fail",
      code: "400",
      message: "Environment variables are missing.",
    };
  }

  const formData = new URLSearchParams();
  Object.entries(smsData).forEach(([key, value]) => {
    if (typeof value === "string") {
      formData.append(key, value);
    }
  });

  try {
    // Make the POST request using fetch
    const response = await fetch(basicSendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    // Parse response as JSON
    const responseData = (await response.json()) as ChannelAuthResponse;

    // Return the JSON response as a plain object
    return responseData;
  } catch (error) {
    console.error("Error authenticating Kakao channel:", error);

    // Return an error response as a plain object
    return {
      result: "fail",
      code: "500",
      message: "Internal Server Error",
    };
  }
}

export async function authAligoCtgSearch() {
  const basicSendUrl = "https://kakaoapi.aligo.in/akv10/category/";

  const sendData = {
    apikey: process.env.KAKAO_API_KEY ?? "", // API key from env
    userid: process.env.ALIGO_USER_ID ?? "", // Aligo site user ID from env
  };
  console.log("sendData : ", sendData);

  // Check if all required environment variables are set
  if (!sendData.apikey || !sendData.userid) {
    console.error("Environment variables are missing.");
    return {
      result: "fail",
      code: "400",
      message: "Environment variables are missing.",
    };
  }

  const formData = new URLSearchParams();
  Object.entries(sendData).forEach(([key, value]) => {
    if (typeof value === "string") {
      formData.append(key, value);
    }
  });

  try {
    // Make the POST request using fetch
    const response = await fetch(basicSendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    // Parse response as JSON
    const responseData = (await response.json()) as ChannelAuthResponse;

    // Return the JSON response as a plain object
    return responseData;
  } catch (error) {
    console.error("Error authenticating Kakao channel:", error);

    // Return an error response as a plain object
    return {
      result: "fail",
      code: "500",
      message: "Internal Server Error",
    };
  }
}
interface IsendAlimtalk {
  apikey: string;
  userid: string;
  senderkey: string;
  tpl_code: string;
  sender: string;
  senddate?: string; // 선택적 필드 (optional)
  receiver: string;
  recvname?: string;
  subject: string;
  message: string;
  button?: object; // JSON 형식으로 받을 것이므로 object 타입
  failover?: "Y" | "N"; // Y 또는 N만 가능
  fsubject?: string;
  fmessage?: string;
  testMode?: "Y" | "N"; // Y 또는 N만 가능, 기본값이 'N'이라 선택적 필드로 정의
}

export async function sendAlimtalk({
  user_name,
}: {
  user_name: FormDataEntryValue | null;
}) {
  const url = ALIGO_SEND_API;
  let company = COMPANY;
  let msg = `안녕하세요. ${user_name}님!
${company}

${company}에 회원가입 해주셔서
진심으로 감사드립니다~`;
  const sendData = {
    apikey: process.env.KAKAO_API_KEY ?? "",
    userid: process.env.ALIGO_USER_ID ?? "",
    senderkey: process.env.SENDER_KEY ?? "",
    tpl_code: SIGN_UP_TEMPLATES,
    sender: "010-4109-6590" ?? "",
    receiver_1: process.env.ADMIN_PHONE_NUMBER ?? "",
    subject: "회원가입완료 안내",
    message_1: msg,
    testMode: "N",
  };

  const params = new URLSearchParams();

  Object.entries(sendData).forEach(([key, value]) => {
    if (typeof value === "string") {
      params.append(key, value);
    }
  });
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: params,
    });

    const result = await response.json();

    if (response.ok) {
      // 요청이 성공적으로 전송되었을 경우
      console.log("알림톡 전송 성공:", result);
      return result;
    } else {
      // 서버에서 200 OK를 반환했지만 코드가 실패를 나타낼 경우
      console.error("알림톡 전송 실패:", result);
      throw new Error(result.message || "알림톡 전송 중 오류 발생");
    }
  } catch (error) {
    console.error("API 요청 오류:", error);
    throw error;
  }
}
export async function authAligoRegisterChannel() {
  const basicSendUrl = "https://kakaoapi.aligo.in/profile/list/";

  const sendData = {
    apikey: process.env.KAKAO_API_KEY ?? "", // API key from env
    userid: process.env.ALIGO_USER_ID ?? "", // Aligo site user ID from env
    plusid: process.env.KAKAO_PLUS_ID ?? "", // Kakao channel ID (with @) from env
    phonenumber: process.env.ADMIN_PHONE_NUMBER ?? "", // Admin phone number from env
  };
  if (
    !sendData.apikey ||
    !sendData.userid ||
    !sendData.plusid ||
    !sendData.phonenumber
  ) {
    console.error("Environment variables are missing.");
    return {
      result: "fail",
      code: "400",
      message: "Environment variables are missing.",
    };
  }

  const formData = new URLSearchParams();
  Object.entries(sendData).forEach(([key, value]) => {
    if (typeof value === "string") {
      formData.append(key, value);
    }
  });

  try {
    // Make the POST request using fetch
    const response = await fetch(basicSendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    // Parse response as JSON
    const responseData = (await response.json()) as ChannelAuthResponse;

    // Return the JSON response as a plain object
    return responseData;
  } catch (error) {
    console.error("Error authenticating Kakao channel:", error);

    // Return an error response as a plain object
    return {
      result: "fail",
      code: "500",
      message: "Internal Server Error",
    };
  }
}
