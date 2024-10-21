import twilio from "twilio";

function formatPhoneNumberToE164(phone: string | null) {
  if (phone !== null && phone.startsWith("010")) {
    return "+82" + phone.slice(1);
  } else {
    throw new Error(
      "Invalid phone number format. It should start with 010. or null"
    );
  }
}

export async function sendTwilioMesage({
  tokenNumber,
  phone,
}: {
  tokenNumber: string;
  phone: string | null;
}) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  client.messages.create({
    body: `인증번호를 입력해주세요.  ${tokenNumber}`,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: formatPhoneNumberToE164(phone),
  });

  return;
}
export async function sendTwilioVbankMsg({
  goodsName,
  bankName,
  accountNum,
  dueDate,
  phone,
}: {
  goodsName: string;
  bankName: string;
  accountNum: string;
  dueDate: string;
  phone: string | null;
}) {
  const date = new Date(dueDate);
  const formattedDate = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  client.messages.create({
    body: `오로라팩 제품:${goodsName} 입금은행:${bankName} 계좌:${accountNum} 기간: ${formattedDate}까지`,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: formatPhoneNumberToE164(phone),
  });

  return;
}
// await sendTwilioVbankMsg({ vbankNum, phone: data.phone });
