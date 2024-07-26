"use server";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { OptionSchema } from "./schema";
import { redirect } from "next/navigation";
import { getCachedCartCount } from "../components/action";
import { getSession } from "@/lib/session";
import { cookies } from "next/headers";

interface IupdateCart{
  cartIds:number[]; 
  orderId:string
}
export async function updateCart({ cartIds, orderId }: IupdateCart) {
  console.log("updateCart 발동")
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
    return { success: false, message: '주문을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.' };
  }
}

export async function delCart({ id }: { id: number }) {
  const cookieStore = cookies();
  const session = await getSession(cookieStore);
  if (!session.id) return;
  await db.cart.delete({
    where: { id },
  });
  revalidateTag("cart");
  // await getCartCount();

  return { ok: true, message: "제거완료" };
}
export async function getCart(session:any) {
  console.log("getCart session : ",session)
  if (!session.id) return [];

  const cartData = await db.cart.findMany({
    where: {
      userId: session.id,
    },
  });
  console.log("cartData : ",cartData);
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

export const getCachedCart = nextCache(async (cookie: any) => {
  const cart = await getCart(cookie);
  return cart;
}, ["cart"]);

export const getCachedProductSrc = nextCache(getProductSrc, ["product-src"], {
  tags: ["product-src"],
});
