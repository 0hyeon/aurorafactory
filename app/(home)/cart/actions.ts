"use server";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { getSession } from "@/lib/session";
import { Cart } from "@prisma/client";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionContent } from "@/lib/types";
import { getCachedLikeStatus } from "@/app/(admin)/actions";
import { number } from "zod";

// Define types for clarity
interface IupdateCart {
  cartIds: number[];
  orderId: string;
  stats: string;
  name?: string;
  phone?: string;
  address?: string;
}
interface IupdateCartCancle {
  orderId: string;
  stats: string;
}

export async function getSessionAurora() {
  const session = await getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-aurorafac",
    password: process.env.COOKIE_PASSWORD!,
  });
  return {
    id: session.id,
    phone: session.phone,
    address: session.address,
    username: session.username,
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

export async function updateCart({
  cartIds,
  orderId,
  stats,
  name,
  phone,
  address,
}: IupdateCart) {
  revalidateCartCount();
  try {
    await db.cart.updateMany({
      where: {
        id: { in: cartIds },
      },
      data: {
        orderstat: stats,
        orderId: orderId,
        name: name,
        phone: phone,
        address: address,
      },
    });

    const session = await getSessionFromCookies();
    if (session.id) {
      await getCachedLikeStatus(session.id);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating cart:", error);
    console.log(" updating cart:", error);
    return {
      success: false,
      message: "주문을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
}
export async function updateCancleCart({ orderId, stats }: IupdateCartCancle) {
  revalidateCartCount();
  try {
    await db.cart.updateMany({
      where: {
        orderId: orderId,
      },
      data: {
        orderstat: stats,
        orderId: null,
      },
    });

    // const session = await getSessionFromCookies();
    // if (!session.id) {
    //   await getCachedLikeStatus(session.id!);
    // }
    const session = await getSessionFromCookies();
    if (session.id) {
      await getCachedLikeStatus(session.id);
    }

    return { success: true };
  } catch (error) {
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

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; message: string };

export async function setCartQuantity({
  id,
  quantity,
}: {
  id: number;
  quantity: number;
}): Promise<ActionResult<{ quantity: number }>> {
  try {
    const session = await getSessionFromCookies();
    if (!session.id) {
      return { ok: false, message: "로그인이 필요합니다." };
    }

    const target = await db.cart.findUnique({
      where: { id },
      select: { id: true, userId: true, quantity: true },
    });
    if (!target)
      return { ok: false, message: "장바구니 항목을 찾을 수 없습니다." };
    if (Number(target.userId) !== Number(session.id)) {
      return { ok: false, message: "권한이 없습니다." };
    }

    // 수량 클램프 (최소1, 최대 999 등)
    const nextQty = Number.isFinite(quantity)
      ? Math.max(1, Math.min(Math.floor(quantity), 999))
      : 1;

    if (nextQty !== target.quantity) {
      await db.cart.update({
        where: { id },
        data: { quantity: nextQty },
      });
      revalidateCartCount();
    }
    return { ok: true, data: { quantity: nextQty } };
  } catch (e) {
    console.error("[setCartQuantity] error:", e);
    return { ok: false, message: "수량 저장에 실패했습니다." };
  }
}
