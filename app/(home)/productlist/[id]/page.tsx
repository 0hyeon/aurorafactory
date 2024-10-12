import React from "react";
import {
  getCachedProductCategory,
  getProductCategory,
  mappingSubtitle,
} from "./actions";
import CategoryList from "./components/CategoryList";

export type Mapping = {
  [key: string]: string;
};
const ProductListPage = async ({ params }: { params: { id: string } }) => {
  const category = params.id;

  //캐싱
  const itemsCategory = await getCachedProductCategory({
    category: mappingSubtitle(category),
  });

  return (
    <div className="max-w-[1000px] mx-auto my-0">
      <CategoryList itemsCategory={itemsCategory} category={category} />
    </div>
  );
};

export default ProductListPage;
// export async function generateStaticParams() {
//   // 모든 가능한 카테고리를 배열로 정의
//   const categories = ["lame", "aircap", "eunbak"];

//   // 각 카테고리에 대해 제품을 가져와 ID를 생성
//   const allParams = await Promise.all(
//     categories.map(async (category) => {
//       const products = await getCachedProductCategory({
//         category: mappingSubtitle(category),
//       });
//       return products.map((product) => ({ id: String(product.id) }));
//     })
//   );

//   // 평탄화하여 하나의 배열로 만듦
//   return allParams.flat();
// }
