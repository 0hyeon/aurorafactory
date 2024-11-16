"use server";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

// Function to fetch cart count based on session ID
export async function fetchCartCount(id: number) {
  const sessionId = id;
  if (!sessionId) return 0;

  const cartCount = await db.cart.count({
    where: {
      userId: Number(sessionId),
      orderstat: {
        not: "결제완료",
      },
    },
  });

  return cartCount;
}

export async function getCachedLikeStatus(sessionId: number) {
  const cachedCartCount = nextCache(fetchCartCount, ["cart-count"], {
    tags: [`cart-count`],
  });
  return cachedCartCount(sessionId);
}
