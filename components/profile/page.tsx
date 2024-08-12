"use server";

import { Username } from "@/app/(home)/components/username";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loading } from "./components";
import { cookies } from "next/headers";

export default async function Profile({ user = "난다고래" }: any) {
  const logOut = async () => {
    const cookieStore = cookies();
    const session = await getSession(cookieStore);
    if (session) {
      await session.destroy();
    }
    redirect("/");
  };

  return (
    <div className="flex gap-5 items-center justify-center">
      <Suspense fallback={<Loading />}>
        <Username user={user} />
      </Suspense>
      <form action={logOut} method="post">
        <button type="submit">Log out</button>
      </form>
    </div>
  );
}
