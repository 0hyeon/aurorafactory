"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { OptionSchema } from "./schema";
import { redirect } from "next/navigation";

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

async function getProductSrc(productId: number) {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { photo: true },
  });
  console.log("getProductSrc : ", product);
  return product?.photo ?? null;
}

export const getCachedCart = nextCache(getCart, ["cart"], {
  tags: ["cart"],
});
export const getCachedProductSrc = nextCache(getProductSrc, ["product-src"], {
  tags: ["product-src"],
});
