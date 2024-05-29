"use server";
import { productSchema } from "./schema";

import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function uploadProduct(formData: FormData) {
  console.log("formData : ", formData);
  const data = {
    photos: formData.get("photos"),
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    discount: formData.get("discount"),
    category: formData.get("category"),
    description: formData.get("description"),
  };
  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // const session = await getSession();
    // if (session.id) {
    let photoUrls: string[] = [];

    if (typeof data.photos === "string") {
      photoUrls = data.photos.split(",");
    }

    console.log(data);
    const product = await db.product.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        photo: result.data.photo,
        category: result.data.category,
        discount: result.data.discount,
        user: {
          connect: {
            id: 1,
          },
        },
        slideimages: {
          connectOrCreate: photoUrls.map((src: any) => {
            return {
              where: { src: src },
              create: { src: src },
            };
          }),
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/products/${product.id}`);
    //redirect("/products")
    // }
  }
}
