export async function handlePaymentVerification(
  orderId: string,
  amount: number,
  isPid: string | null
): Promise<{ status: string; message?: string }> {
  console.log("orderId : ", orderId);
  console.log("amount : ", amount);
  console.log("isPid : ", isPid);
  try {
    const response = await fetch(
      "https://aurorafactory.vercel.app/api/nicepay",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, amount, isPid }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("errorText : ", errorText);
      console.error("Failed to verify payment:", response.status, errorText);
      throw new Error(
        `Failed to verify payment: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("서버 요청 오류:", error);
    return {
      status: "error",
      message: "결제 확인 중 오류가 발생했습니다.",
    };
  }
}
