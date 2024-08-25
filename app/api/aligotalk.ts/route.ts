// import { NextRequest, NextResponse } from "next/server";

// // Define types for clarity
// interface ChannelAuthResponse {
//   result: string;
//   code: string;
//   message: string;
//   info?: any; // Replace 'any' with the appropriate type based on your expected response
// }

// // The POST request handler function
// export async function POST(request: NextRequest): Promise<NextResponse> {
//   const basicSendUrl = "https://kakaoapi.aligo.in/akv10/profile/auth/"; // URL to send request to, currently for Kakao channel authentication

//   // Data to be sent in the POST request, retrieved from environment variables
//   const smsData = {
//     apikey: process.env.KAKAO_API_KEY ?? "", // API key from env
//     userid: process.env.ALIGO_USER_ID ?? "", // Aligo site user ID from env
//     plusid: process.env.KAKAO_PLUS_ID ?? "", // Kakao channel ID (with @) from env
//     phonenumber: process.env.ADMIN_PHONE_NUMBER ?? "", // Admin phone number from env
//   };
//   //     const senderkey = 'cd0e3a2b9549589491efae77c9115b9407ff0992';

//   // Convert `smsData` to `URLSearchParams`
//   const formData = new URLSearchParams();
//   Object.entries(smsData).forEach(([key, value]) => {
//     if (typeof value === "string") {
//       formData.append(key, value);
//     }
//   });

//   try {
//     // Make the POST request using fetch
//     const response = await fetch(basicSendUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: formData,
//     });

//     // Parse response as JSON
//     const responseData = (await response.json()) as ChannelAuthResponse;

//     // Return the JSON response wrapped in NextResponse
//     return NextResponse.json(responseData);
//   } catch (error) {
//     console.error("Error authenticating Kakao channel:", error);

//     // Return an error response
//     return NextResponse.json(
//       {
//         result: "fail",
//         code: "500",
//         message: "Internal Server Error",
//       },
//       { status: 500 }
//     );
//   }
// }
