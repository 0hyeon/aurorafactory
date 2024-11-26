"use server";
import { productSchema } from "./schema";

import db from "@/lib/db";
import getSessionCarrot, { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadProduct(formData: FormData) {
  const photo = formData.get("photo") as File | null;
  const photos = formData.getAll("photos") as File[];
  const category = formData.get("category")?.toString() || "Default Category";

  // Cloudflare 업로드 URL을 미리 요청하고 파일 업로드
  const uploadedPhotoUrl = photo ? await uploadFileWithPreparedUrl(photo) : "";
  const uploadedSlideUrls = await Promise.all(
    photos.map((file) => uploadFileWithPreparedUrl(file))
  );

  // 데이터베이스 저장
  await db.productPicture.create({
    data: {
      photo: uploadedPhotoUrl,
      category,
      slideimages: {
        connectOrCreate: uploadedSlideUrls.map((url) => ({
          where: { src: url },
          create: { src: url },
        })),
      },
    },
  });
  redirect(`/admin/common`);
}
export async function uploadUpdateProduct(formData: FormData) {
  const id = parseInt(formData.get("id")?.toString() || "", 10);
  const photo = formData.get("photo") as File | null;
  const photos = formData.getAll("photos") as File[];
  const category = formData.get("category")?.toString() || "Default Category";

  // Cloudflare 업로드 URL을 미리 요청하고 파일 업로드
  const uploadedPhotoUrl = photo ? await uploadFileWithPreparedUrl(photo) : "";

  const uploadedSlideUrls = await Promise.all(
    photos.map((file) => uploadFileWithPreparedUrl(file))
  );

  // 데이터베이스 업데이트
  await db.productPicture.update({
    where: { id },
    data: {
      photo: uploadedPhotoUrl || undefined,
      category,
      slideimages: {
        connectOrCreate: uploadedSlideUrls.map((url) => ({
          where: { src: url },
          create: { src: url },
        })),
      },
    },
  });
  redirect(`/admin/common`);
}
async function uploadFileWithPreparedUrl(file: File): Promise<string> {
  // 업로드 URL 요청
  const { result } = await getUploadUrl();
  const { uploadURL } = result;

  // FormData에 파일 추가
  const formData = new FormData();
  formData.append("file", file);

  // 파일 업로드
  const uploadResponse = await fetch(uploadURL, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to Cloudflare.");
  }

  const { result: resultJson } = await uploadResponse.json();
  const { id } = resultJson;
  console.log("id : ", id);
  return `https://imagedelivery.net/z_5GPN_XNUgqhNAyIaOv1A/${id}`;
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
