"use server";
import { productSchema, ProductType } from "./schema";

import db from "@/lib/db";
import getSessionCarrot, { getSession } from "@/lib/session";
import { NullableProduct } from "@/types/type";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadUpdateProduct(
  formData: FormData,
  productId: number
) {
  const data = {
    photos: formData.get("photos"),
    photo: formData.get("photo"),
    category: formData.get("category"),
  };
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    let photoUrls: string[] = [];
    if (typeof data.photos === "string") {
      photoUrls = data.photos.split(",");
    }

    const session = await getSessionCarrot();
    console.log("getSessionCarrot : ", session.id);

    // 제품 업데이트 쿼리 실행
    const product = await db.productPicture.update({
      where: {
        id: productId, // 업데이트할 제품의 id를 where로 사용
      },
      data: {
        photo: result.data.photo,
        category: result.data.category,
        slideimages: {
          // 슬라이드 이미지도 업데이트
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
    console.log("update  : ", product);
    revalidateTag("products");
    revalidateTag("product-detail");
    redirect(`/products/${product.id}`);
    return product; // 성공 시 업데이트된 제품 반환
  }
}
export async function uploadProduct(formData: FormData) {
  console.log("formData : ", formData);
  const data = {
    photos: formData.get("photos"),
    photo: formData.get("photo"),
    category: formData.get("category"),
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
    const session = await getSessionCarrot();
    console.log("getSessionCarrot : ", session.id);

    const product = await db.productPicture.create({
      data: {
        photo: result.data.photo,
        category: result.data.category,
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
    revalidateTag("products");
    revalidateTag("product-detail");
    redirect(`/products/${product.id}`);
    //redirect("/products")
    // }
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
  console.log("data : ", data);
  return data;
}
export async function handleProductSubmit(
  formData: FormData,
  edit?: NullableProduct
) {
  const uploadFile = async (file: File, url: string) => {
    const fileData = new FormData();
    fileData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      body: fileData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file to ${url}`);
    }
  };

  // 메인 이미지 처리
  if (formData.has("file")) {
    const file = formData.get("file") as File;
    const uploadUrl = formData.get("uploadUrl") as string;
    await uploadFile(file, uploadUrl);
    formData.append("photo", uploadUrl);
  } else if (edit) {
    formData.append("photo", edit.photo || "");
  }

  // 슬라이드 이미지 처리
  const slideFiles = JSON.parse(formData.get("slideFiles") as string) as File[];
  const slideUrls = JSON.parse(formData.get("slideUrls") as string) as string[];

  for (let i = 0; i < slideFiles.length; i++) {
    await uploadFile(slideFiles[i], slideUrls[i]);
  }
  formData.append("photos", slideUrls.join(","));

  // 업데이트 또는 생성 처리
  if (edit) {
    const errors = await uploadUpdateProduct(formData, edit.id);
    if (errors) {
      throw new Error("Update failed");
    }
  } else {
    const errors = await uploadProduct(formData);
    if (errors) {
      throw new Error("Create failed");
    }
  }
}
