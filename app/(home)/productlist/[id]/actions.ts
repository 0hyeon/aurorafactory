import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { Mapping } from "./page";
import { IProduct } from "@/types/type";

export async function getProductCategory({ category }: { category: string }) {
  const productCategory = await db.product.findMany({
    where: {
      productPicture: {
        category: category,
      },
    },
    include: {
      productoption: true,
      productPicture: {
        select: {
          category: true,
          photo: true,
        },
      },
    },
  });
  return productCategory as IProduct[];
}

export const getCachedProductCategory = ({
  category,
}: {
  category: string;
}) => {
  return nextCache(getProductCategory, ["products"], {
    tags: ["products"],
  })({ category });
};
export const mappingSubtitle = (item: string): string => {
  const mapping: Mapping = {
    lame: "라미봉투",
    aircap: "에어캡봉투",
    eunbak: "보냉봉투",
  };

  return mapping[item];
};
export const mappingSubDesc = (title: string): string => {
  const mapping: Mapping = {
    라미봉투: "가성비ㆍ탁월한",
    에어캡봉투: "완충효과 100%",
    보냉봉투: "온도유지",
    undefined: "",
  };

  return mapping[title] || "default";
};
export const mappingtitle = (item: string): string => {
  const mapping: Mapping = {
    라미봉투: "lame",
    에어캡봉투: "aircap",
    보냉봉투: "eunbak",
    undefined: "all",
    전체상품: "all",
  };

  return mapping[item];
};
