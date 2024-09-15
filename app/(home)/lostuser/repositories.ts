import db from "@/lib/db";

export const getUserWithEmail = async (email: string) => {
  const result = await db.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  });
  console.log(result);
  return result;
};
export const getUserWithPhone = async (phone: string) => {
  const result = await db.user.findUnique({
    where: { phone },
    select: { id: true, password: true },
  });
  console.log("getUserWithPhone : ", result);
  return result;
};
