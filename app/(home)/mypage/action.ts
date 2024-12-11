"use server";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { getSession } from "@/lib/session";
import { Cart } from "@prisma/client";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionContent } from "@/lib/types";
import { getCachedLikeStatus } from "@/app/(admin)/actions";

async function fetchOderedData(userId: string): Promise<Cart[]> {
  return await db.cart.findMany({
    where: {
      userId: Number(userId),
      orderstat: { equals: "결제완료" },
    },
    include: {
      product: {
        include: {
          productPicture: {
            select: {
              photo: true,
            },
          },
          productoption: true,
        },
      },
    },
  });
}

export const getCachedOrdered = nextCache(
  async (userId: string) => {
    return await fetchOderedData(userId);
  },
  ["order-data"],
  {
    tags: ["cart"],
  }
);
