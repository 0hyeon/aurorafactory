// serverComponent.tsx
"use server";

import { NullableProduct } from "@/types/type";
import { getCachedProduct } from "../../option/[id]/actions";
import AddProductCommon from "../../common/page";

export default async function OptionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getCachedProduct(+params.id);
  return (
    // <AddOptionDetailpage params={params} product={product as NullableProduct} />
    <AddProductCommon edit={product as NullableProduct} />
  );
}
