import { getCachedProducts } from "@/app/(home)/products/[id]/page";
import { revalidateTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";

export default async function AddOptionList() {
  const product = await getCachedProducts();
  revalidateTag("products");
  console.log("product : ", product);
  return (
    <div className="flex w-11/12 flex-wrap gap-8 mx-auto p-14 bg-gray-50 rounded-lg shadow-lg">
      {product &&
        product.map((el) => {
          return (
            <Link
              href={`/admin/option/${el.id}`}
              key={el.id}
              className="w-56 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative block w-full h-40 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                {el.productPicture?.photo ? (
                  <Image
                    src={`${el.productPicture?.photo}/public`}
                    alt={el.title || "Product Image"}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                    이미지 없음
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800">
                  {el.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{el.category}</p>
                <p className="text-sm font-bold text-gray-900">
                  {el.price ? `${el.price.toLocaleString()}원` : "가격 없음"}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  옵션 : {el._count.productoption}개
                </p>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
