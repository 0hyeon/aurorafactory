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
