// paymentUtil.ts
export async function handlePaymentVerification(
  orderId: string,
  amount: number,
  isPid: string | null
): Promise<{ status: string; message?: string }> {
  try {
    const response = await fetch("/api/nicepay/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, amount, isPid }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify payment");
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
