"use server";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function cartCreate({ quantity, cartId }: any) {
  console.log("cart action data : ", quantity, cartId);
}
// const product = await db.product.create({
//     data: {
//       title: result.data.title,
//       description: result.data.description,
//       price: result.data.price,
//       photo: result.data.photo,
//       category: result.data.category,
//       discount: result.data.discount,
//       user: {
//         connect: {
//           id: 1,
//         },
//       },
//       slideimages: {
//         connectOrCreate: photoUrls.map((src: any) => {
//           return {
//             where: { src: src },
//             create: { src: src },
//           };
//         }),
//       },
//     },
//     select: {
//       id: true,
//     },
//   });
//   redirect(`/products/${product.id}`);
