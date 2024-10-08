import { getCachedProducts } from "@/app/(home)/products/[id]/page";
import { revalidateTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";

export default async function AddOptionList() {
  const product = await getCachedProducts();
  revalidateTag("products");
  return (
    <div className="flex w-11/12 flex-wrap p-14">
      {product &&
        product.map((el) => {
          return (
            <Link href={`/admin/option/${el.id}`} key={el.id}>
              <div className="relative block w-28 h-28">
                <Image
                  src={`${el.photo}/public`}
                  alt={el.photo}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>{el.title}</div>
              <div>{el.category}</div>
              <div>{el.price}</div>
            </Link>
          );
        })}
    </div>
  );
}
