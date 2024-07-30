import { getUserProfile } from "@/lib/session";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";

export const Username = ({ user }: any) => {
  if (typeof user === "string" && user === "") {
    return <h1 className="text-xl">로그인 해주세요</h1>;
  }

  return <h1 className="text-sm">어서 오세요 {user?.username}님!</h1>;
};
