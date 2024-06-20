import { getUserProfile } from "@/lib/session";

export const Username = async () => {
  await new Promise((res) => setTimeout(res, 3000));
  const user = await getUserProfile();
  console.log("user : ", user);

  if (typeof user === "string" && user === "") {
    return <h1 className="text-xl">로그인 해주세요</h1>;
  }

  return <h1 className="text-xl">어서 오세요 {user?.username}님!</h1>;
};
