import { getUserProfile, logout } from "@/lib/session";
import { Suspense } from "react";
import { Loading } from "./components";
const Profile = async () => {
  const user = await getUserProfile();

  return (
    <div className="flex gap-5 items-center justify-center">
      <Suspense fallback={<Loading />}>
        {user && user ? (
          <>
            <h1 className="text-[16px]">어서 오세요 {user?.username}님!</h1>
            <form action={logout}>
              <button>로그아웃</button>
            </form>
          </>
        ) : (
          ""
        )}
      </Suspense>
    </div>
  );
};

export default Profile;
