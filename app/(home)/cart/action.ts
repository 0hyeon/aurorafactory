"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { OptionSchema } from "./schema";
import { redirect } from "next/navigation";
import { getCartCount, getCachedCartCount } from "../components/action";

export async function delCart({ id }: { id: number }) {
  const session = await getSession();
  if (!session.id) return;
  await db.cart.delete({
    where: { id },
  });
  revalidateTag("cart");
  // await getCartCount();

  return { ok: true, message: "제거완료" };
}
export async function getCart() {
  const session = await getSession();
  if (!session.id) return [];

  const cartData = await db.cart.findMany({
    where: {
      userId: session.id,
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

export const getCachedCart = nextCache(getCart, ["cart"], {
  tags: ["cart"],
});
export const getCachedProductSrc = nextCache(getProductSrc, ["product-src"], {
  tags: ["product-src"],
});
