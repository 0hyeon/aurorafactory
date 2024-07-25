'use server';

import { getUserProfile } from "@/lib/session";
import { Suspense } from "react";
import { Loading } from "./components";
import LogoutButton from "./components/LogoutButton";
import { cookies } from "next/headers";

const Profile = async () => {
  const cookieStore = cookies();
  const user = await getUserProfile(cookieStore);

  return (
    <div className="flex gap-5 items-center justify-center">
      <Suspense fallback={<Loading />}>
        {user ? (
          <>
            <h1 className="text-[16px]">어서 오세요 {user.username}님!</h1>
            <LogoutButton />
          </>
        ) : (
          ""
        )}
      </Suspense>
    </div>
  );
};

export default Profile;
