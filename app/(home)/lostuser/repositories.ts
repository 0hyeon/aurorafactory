import db from "@/lib/db";

export const getUserWithEmail = async (email: string) => {
  const result = await db.user.findUnique({
    where: { email },
    select: { id: true, password: true,phone: true},
  });
  console.log(result);
  return result;
};

export const getUserWithPhone = async (phone: string) => {
  const result = await db.user.findUnique({
    where: { phone },
    select: { id: true, email: true,phone: true },
  });
  console.log("getUserWithPhone : ", result);
  return result;
};
export const updateUser = async ({
  data,
  hashedPassword,
}: {
  data: any;
  hashedPassword: string;
}) => {
  const result = await db.user.update({
    where: { email: data.email, phone: data.phone },
    data: {
      password: hashedPassword,
    },
    select: { id: true },
  });

  return result;
};
