import { Username } from "@/app/(home)/components/username";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loading } from "./components";

export default async function Profile({ user }: any) {
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };

  return (
    <div className="flex gap-5 items-center justify-center">
      <Suspense fallback={<Loading />}>
        <Username user={user} />
      </Suspense>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}
