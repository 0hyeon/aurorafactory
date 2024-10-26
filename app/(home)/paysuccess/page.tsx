// app/payment-success/page.tsx (서버 컴포넌트)

import { Metadata } from "next";
import {
  authAligoCtgSearch,
  authAligoRegisterChannel,
  authAligoToken,
  sendAlimtalk,
} from "./actions";
import PaySuccess from "./component/PaySuccess ";
import { revalidateCartCount } from "../cart/actions";

export const metadata: Metadata = {
  title: "Payment Success",
  description: "Payment success page after a successful transaction.",
};

export default async function PaymentSuccessPage() {
  revalidateCartCount();
  // `authAligoToken` 함수를 서버 컴포넌트 내에서 실행합니다.
  //const tokenResponse = await authAligoToken();
  //const tokenResponseCtg = await authAligoCtgSearch();
  // const check = await authAligoRegisterChannel();

  //const sendMessage = await sendAlimtalk();

  //console.log("check : ", check);
  // 필요한 경우 tokenResponse를 PaySuccess에 prop으로 전달할 수 있습니다.

  return (
    <div className="container mx-auto p-4">
      <PaySuccess />
    </div>
  );
}
