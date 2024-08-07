"use server";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

// Function to fetch cart count based on session ID
async function fetchCartCount() {
  console.log("fetchCartCount 실행 :");
  const session = await getSession();
  const sessionId = session.id;
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
export const getCachedCartCount = nextCache(async () => {
  console.log("getCachedCartCount 실행");
  const count = await fetchCartCount();
  return count;
}, ["cart-count"]);

// 별도의 revalidateTag 함수 호출
export async function revalidateCartCount() {
  revalidateTag("cart-count");
  revalidateTag("cart");
}
