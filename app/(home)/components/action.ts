"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export async function getCartCount() {
  const session = await getSession();
  if (!session.id) return 0;

  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    include: {
      _count: {
        select: {
          Cart: true,
        },
      },
    },
  });
  if (!user) return 0;
  return user?._count.Cart;
}
