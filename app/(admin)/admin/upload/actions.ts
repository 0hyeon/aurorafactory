"use server";
import db from "@/lib/db";
import getSessionCarrot from "@/lib/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";

export async function getCategory() {
  const categories = await db.productPicture.findMany({});
  return categories;
}

export async function uploadProduct(prevState: any, formData: FormData) {
  console.log("prevState : ", prevState);
  console.log("formData : ", formData);
  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    discount: formData.get("discount"),
    category: formData.get("category"),
    description: formData.get("description"),
    productPictureId: formData.get("productPictureId"),
  };
  console.log("uploadProduct : ", data);
  const result = productSchema.safeParse(data);
  console.log("result : ", result);
  console.log("result.error : ", result.error);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSessionCarrot(); // 세션 가져오기
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
            id: session.id, // 세션 사용자와 연결
          },
        },
        productPicture: {
          connect: { id: Number(result.data.productPictureId) },
        },
      },
      select: {
        id: true,
      },
    });

    console.log("product : ", product);
    revalidateTag("products");
    revalidateTag("product-detail");
    redirect(`/products/${product.id}`);
  }
}
export async function uploadUpdateProduct(
  formData: FormData,
  productId: number
) {
  const data = {
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
    const session = await getSessionCarrot();
    await db.product.update({
      where: { id: productId },
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        category: result.data.category,
        discount: result.data.discount,
        user: {
          connect: {
            id: session.id, // 세션 사용자와 연결
          },
        },
        productPicture: {
          connect: { id: Number(result.data.productPictureId) },
        },
      },
    });

    revalidateTag("products");
    revalidateTag("product-detail");
    redirect(`/admin/option`);
  }
}
