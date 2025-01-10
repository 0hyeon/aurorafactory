//action.ts
"use server";
import { OptionSchema } from "./schema";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
export async function uploadProductOption(prevState: any, formData: FormData) {
  const data = {
    color: formData.get("color"),
    quantity: formData.get("quantity"),
    plusdiscount: formData.get("plusdiscount"),
    connectProductId: formData.get("connectProductId"),
    deliver_price: formData.get("deliver_price"),
    plusPrice: formData.get("plusPrice"),
  };
  const result = OptionSchema.safeParse(data);
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
        deliver_price: +result.data.deliver_price,
        plusPrice: +result.data.plusPrice,
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
    redirect(`/admin/option/${data.connectProductId}`);
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
