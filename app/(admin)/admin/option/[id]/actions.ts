//action.ts
"use server";
import { OptionSchema } from "./schema";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
export async function uploadProductOption(formData: FormData) {
  console.log("formData : ", formData);
  const data = {
    color: formData.get("color"),
    quantity: formData.get("quantity"),
    plusdiscount: formData.get("plusdiscount"),
    connectProductId: formData.get("connectProductId"),
  };
  const result = OptionSchema.safeParse(data);
  console.log("result : ", result);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // const session = await getSession();
    // if (session.id) {

    const productOption = await db.productOption.create({
      data: {
        quantity: +result.data.quantity,
        color: result.data.color,
        plusdiscount: +result.data.plusdiscount,
        product: {
          connect: {
            id: Number(result.data.connectProductId),
          },
        },
      },
      select: {
        id: true,
      },
    });
    revalidateTag("product-detail");
    revalidateTag("products");
    redirect("/admin/option");
    return null;
  }
}
async function getProduct(id: number) {
  const product = db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
      productPicture: {
        include: {
          slideimages: true,
        },
      },
      productoption: true,
    },
  });

  return product;
}

export async function delProductOption({
  id,
  redirectId,
}: {
  id: number;
  redirectId: number;
}) {
  console.log("id : ", id);
  console.log("redirectId : ", redirectId);
  const product = db.productOption.delete({
    where: {
      id,
    },
  });
  revalidateTag("product-detail");
  revalidateTag("products");
  return product;
}
export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});
