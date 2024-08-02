"use server";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

// Function to fetch cart count based on session ID
async function fetchCartCount(cookie: any) {
  console.log("fetchCartCount 실행 :", cookie);
  const sessionId = cookie;
  if (!sessionId) return 0;

  const user = await db.user.findUnique({
    where: { id: Number(sessionId) },
    include: {
      _count: {
        select: { Cart: true },
      },
    },
  });

  return user ? user._count.Cart : 0;
}

// Create a cached function that accepts session ID
export const getCachedCartCount = nextCache(
  async (cookie: any) => {
    const count = await fetchCartCount(cookie);
    return count;
  },
  ["cart-count", "cart"]
);

// 별도의 revalidateTag 함수 호출
export async function revalidateCartCount() {
  revalidateTag("cart-count");
  revalidateTag("cart");
}
