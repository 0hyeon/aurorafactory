"use server";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { getSession } from "@/lib/session";
import { getCachedCartCount, revalidateCartCount } from "../components/action";
import { Cart } from "@prisma/client";
import { cookies } from "next/headers";

interface IupdateCart {
  cartIds: number[];
  orderId: string;
}
const cookieStore = cookies();
export async function updateCart({ cartIds, orderId }: IupdateCart) {
  try {
    await db.cart.updateMany({
      where: {
        id: {
          in: cartIds,
        },
      },
      data: {
        orderstat: "결제완료",
        orderId: orderId,
      },
    });

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
  // revalidateTag("cart");
  revalidateCartCount();

  const session = await getSession(cookieStore);
  getCachedCartCount(session.id);
  const cartData: Cart[] = await getCachedCart();

  if (!session.id) return;
  await db.cart.delete({
    where: { id },
  });

  return { ok: true, message: "제거완료" };
}
export async function getCart() {
  const session = await getSession(cookieStore);
  if (!session.id) return [];

  const cartData = await db.cart.findMany({
    where: {
      userId: session.id,
      orderstat: {
        not: "결제완료",
      },
    },
  });

  return cartData;
}
// export async function getPurChase() {
//   const session = await getSession();
//   console.log("session: ", session);
//   if (!session.id) return { ok: false, message: " 로그인 후 이용해주세요" };
// }

async function getProductSrc(productId: number) {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { photo: true },
  });
  return product?.photo ?? null;
}

export const getCachedCart = nextCache(getCart, ["product-src"], {
  tags: ["cart"],
});
export const getCachedProductSrc = nextCache(getProductSrc, ["product-src"], {
  tags: ["product-src"],
});
