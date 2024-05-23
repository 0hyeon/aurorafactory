import { getUserProfile } from '@/lib/session';

export const Username = async () => {
  await new Promise((res) => setTimeout(res, 3000));
  const user = await getUserProfile();

  return <h1 className="text-[16px]">어서 오세요 {user?.username}님!</h1>;
};