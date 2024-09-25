import { getProducts } from "@/app/(home)/products/[id]/page";
import BestItem from "./BestItem";

const ProductList = async ({ method }: { method: string }) => {
  console.log("method : ", method);
  const products = await getProducts(); // 메서드에 따라 제품 가져오기
  console.log("products : ", products);
  return <BestItem subtitle="" title="" data={products} />;
};

export default ProductList;
