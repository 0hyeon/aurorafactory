"use server";
import { slideImage } from "@prisma/client";
import { productSchema } from "./schema";

import db from "@/lib/db";
import getSessionCarrot, { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadUpdateProduct(
  formData: FormData,
  productId: number
) {
  const data = {
    // photos: formData.get("photos"),
    // photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    discount: formData.get("discount"),
    category: formData.get("category"),
    description: formData.get("description"),
    productPictureId: Number(formData.get("productPictureId")),
  };
  console.log("data : ", data);
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // let photoUrls: string[] = [];
    // if (typeof data.photos === "string") {
    //   photoUrls = data.photos.split(",");
    // }

    const session = await getSessionCarrot();
    console.log("getSessionCarrot : ", session.id);

    // 제품 업데이트 쿼리 실행
    const product = await db.product.update({
      where: {
        id: productId, // 업데이트할 제품의 id를 where로 사용
      },
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        // photo: result.data.photo,
        category: result.data.category,
        discount: result.data.discount,
        productPicture: {
          connect: { id: Number(result.data.productPictureId) }, // 연결할 productPicture ID
        },
      },
      select: {
        id: true,
      },
    });
    console.log("update  : ", product);
    revalidateTag("products");
    revalidateTag("product-detail");
    redirect(`/admin/option`);
  }
}
export async function getCategory() {
  const categoryies = await db.productPicture.findMany({});
  return categoryies;
}
export async function uploadProduct(formData: FormData) {
  console.log("formData : ", formData);
  const data = {
    // photos: formData.get("photos"),
    // photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    discount: formData.get("discount"),
    category: formData.get("category"),
    description: formData.get("description"),
    productPictureId: Number(formData.get("productPictureId")),
  };
  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // const session = await getSession();
    // if (session.id) {
    //let photoUrls: string[] = [];

    // if (typeof data.photos === "string") {
    //   photoUrls = data.photos.split(",");
    // }
    const session = await getSessionCarrot();
    console.log("getSessionCarrot : ", session.id);

    const product = await db.product.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        category: result.data.category,
        discount: result.data.discount,
        user: {
          connect: {
            id: session.id,
          },
        },
        productPicture: {
          connect: { id: result.data.productPictureId },
        },
      },
      select: {
        id: true,
      },
    });
    revalidateTag("products");
    revalidateTag("product-detail");
    redirect(`/products/${product.id}`);

    redirect("/products");
  }
}

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
}
