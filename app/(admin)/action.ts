"use server";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

// Function to fetch cart count based on session ID
export async function fetchCartCount(id: number) {
  console.log("fetchCartCount 실행 :");
  console.log("id : ", id);
  const sessionId = id;
  if (!sessionId) return 0;
  const user = await db.user.findUnique({
    where: { id: Number(sessionId) },
    include: {
      _count: {
        select: { Cart: true },
      },
    },
  });
  console.log("user._count.Cart : ", user ? user._count.Cart : null);
  return user ? user._count.Cart : 0;
}

export async function getCachedLikeStatus(sessionId: number) {
  const cachedCartCount = nextCache(fetchCartCount, ["cart-count"], {
    tags: [`cart-count`],
  });
  return cachedCartCount(sessionId);
}

// 별도의 revalidateTag 함수 호출
// export async function revalidateCartCount() {
//   revalidateTag("cart-count");
//   revalidateTag("cart");
// }
