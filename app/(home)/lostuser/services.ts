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
  price,
}: {
  goodsName: string;
  bankName: string;
  accountNum: string;
  dueDate: string;
  phone: string | null;
  price: any;
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
    body: `${goodsName} ${bankName} ${accountNum} ${formattedDate}까지 ${price}원`,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: formatPhoneNumberToE164(phone),
  });

  return;
}
export async function sendTwilioVbankSuccessMsg({
  goodsName,
  phone,
}: {
  goodsName: string;
  phone: string | null;
}) {
  console.log("sendTwilioVbankSuccessMsg : ",goodsName, phone)
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  const message = client.messages.create({
    body: `오로라팩 ${goodsName} 주문이 완료되었습니다. 감사합니다.`,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: formatPhoneNumberToE164(phone),
  });
  console.log("message : ",message)

  return;
}
// await sendTwilioVbankMsg({ vbankNum, phone: data.phone });
