import { getProducts } from "@/app/(home)/products/[id]/page";
import BestItem from "./BestItem";

const ProductList = async ({ method }: { method: string }) => {
  const products = await getProducts(); // 메서드에 따라 제품 가져오기
  return <BestItem subtitle="" title="" data={products} />;
};

export default ProductList;
