"use server";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { getSession } from "@/lib/session";
import { Cart } from "@prisma/client";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionContent } from "@/lib/types";

// Define types for clarity
interface IupdateCart {
  cartIds: number[];
  orderId: string;
}

export async  function getSessionAurora() {
  const session =  await getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-aurorafac",
    password: process.env.COOKIE_PASSWORD!,
  });
  console.log("getSessionAurora : ",session)
  return {
    id: session.id,  // 필요한 정보만 추출
    phone: session.phone
  };
}

export async function getSessionFromCookies() {
  const cookieStore = cookies();
  return await getSession(cookieStore);
}

// Define the function to get cart data
async function fetchCartData(userId: string): Promise<Cart[]> {
  return await db.cart.findMany({
    where: {
      userId: Number(userId),
      orderstat: { not: "결제완료" },
    },
  });
}

// Define the cache functions with proper typing
export const getCachedCart = nextCache(
  async (userId: string) => {
    return await fetchCartData(userId);
  },
  ["cart-data"],
  {
    tags: ["cart"],
  }
);

export async function updateCart({ cartIds, orderId }: IupdateCart) {
  try {
    await db.cart.updateMany({
      where: {
        id: { in: cartIds },
      },
      data: {
        orderstat: "결제완료",
        orderId: orderId,
      },
    });
    await revalidateCartCount(); // 캐시된 카트 카운트를 갱신

    return { success: true };
  } catch (error) {
    console.error("Error updating cart:", error);
    return {
      success: false,
      message: "주문을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
}

export async function delCart({ id }: { id: number }) {
  revalidateCartCount();

  const session = await getSessionFromCookies();
  if (!session.id) return { ok: false, message: "로그인 필요" };

  await db.cart.delete({ where: { id } });

  // Ensure the cart is reloaded after deletion
  await getCachedCart(String(session.id));

  return { ok: true, message: "제거완료" };
}

export async function getCart() {
  const session = await getSessionFromCookies();
  if (!session.id) return [];

  return await fetchCartData(String(session.id));
}

export async function postMessage() {}

async function getProductSrc(productId: number): Promise<string | null> {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { photo: true },
  });
  return product?.photo ?? null;
}

export const getCachedProductSrc = nextCache(getProductSrc, ["product-src"], {
  tags: ["product-src"],
});

export async function revalidateCartCount() {
  revalidateTag("cart-count");
  revalidateTag("cart");
}
