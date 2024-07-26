// components/action.ts
import db from "@/lib/db";
import { unstable_cache as nextCache } from "next/cache";
import { cookies } from "next/headers";

// Function to fetch cart count based on session ID
async function fetchCartCount(cookie:any) {
  console.log("fetchCartCount 실행 :",cookie);
  const sessionId = cookie
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
  async (cookie) => fetchCartCount(cookie),
  ["cart-count"]
);
