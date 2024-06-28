"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export async function getCart() {
  const session = await getSession();
  if (!session.id) return;

  const cartData = await db.cart.findMany({
    where: {
      userId: session.id,
    },
  });
  return cartData;
}
