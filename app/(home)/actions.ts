"use server";

import { getSession } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logOut = async () => {
  const cookieStore = cookies();
  const session = await getSession(cookieStore);
  await session.destroy();
  redirect("/");
};
