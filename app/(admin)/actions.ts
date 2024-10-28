"use server";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

// Function to fetch cart count based on session ID
export async function fetchCartCount(id: number) {
  const sessionId = id;
  console.log("fetchCartCount인자 : ", id);
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

// export async function fetchCartCount(id: number) {
//   const sessionId = id;
//   if (!sessionId) return 0;
//   const user = await db.user.findUnique({
//     where: { id: Number(sessionId) },
//     include: {
//       _count: {
//         select: { Cart: true },
//       },
//     },
//   });
//   console.log("user._count.Cart : ", user ? user._count.Cart : null);
//   return user ? user._count.Cart : 0;
// }

export async function getCachedLikeStatus(sessionId: number) {
  const cachedCartCount = nextCache(fetchCartCount, ["cart-count"], {
    tags: [`cart-count`],
  });
  return cachedCartCount(sessionId);
}
