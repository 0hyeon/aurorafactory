import db from "@/lib/db";

export const createUser = async (data: any, hashedPassword: string) => {
  const result = await db.user.create({
    data: {
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      address: data.address,
      postaddress: data.postaddress,
      detailaddress: data.detailaddress,
    },
    select: { id: true },
  });

  return result;
};

export const getUserIdWithEmail = async (email: string) => {
  const result = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return result;
};

export const getUserIdWithUsername = async (username: string) => {
  const result = await db.user.findFirst({
    where: { username },
    select: { id: true },
  });

  return result;
};

export async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  console.log("tokenExists : ", exists);
  return Boolean(exists);
}
