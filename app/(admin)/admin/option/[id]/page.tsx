// serverComponent.tsx
"use server";

import { getCachedProduct } from "./action";
import AddOptionDetailpage from "./components/AddOptionDetailpage";

export default async function OptionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getCachedProduct(+params.id);
  return <AddOptionDetailpage params={params} product={product} />;
}
