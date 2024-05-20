import db from '@/lib/db';

export const createUser = async (data: any, hashedPassword: string) => {
  console.log("createUser : ",data)
  const result = await db.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      address: data.address,
      postaddress: data.postaddress,
      detailaddress: data.detailaddress
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
  console.log("getUserIdWithEmail : ",result)
  return result;
};

// export const getUserIdWithUsername = async (username: string) => {
//   const result = await db.user.findUnique({
//     where: { username },
//     select: { id: true },
//   });
//   return result;
// };