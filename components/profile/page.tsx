'use server';

import { getUserProfile } from "@/lib/session";
import { Suspense } from "react";
import { Loading } from "./components";
import LogoutButton from "./components/LogoutButton";

const Profile = async () => {
  const user = await getUserProfile();

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
