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

const categoryMeta: Record<string, { title: string; description: string }> = {
  lame: {
    title: '라미봉투',
    description: '가성비 탁월한 라미봉투. 오로라팩 공장직 포장재를 합리적인 가격으로 만나보세요.',
  },
  aircap: {
    title: '에어캡봉투',
    description: '완충효과 100% 에어캡봉투. 안전한 배송을 위한 오로라팩의 포장 솔루션.',
  },
  eunbak: {
    title: '보냉봉투',
    description: '온도 유지 보냉봉투. 신선식품 배송을 위한 오로라팩의 보냉 포장재.',
  },
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  const info = categoryMeta[params.id] ?? {
    title: '전체상품',
    description: '오로라팩 공장직 포장재 전체 상품 목록. 발포지·에어캡봉투·보냉봉투·라미봉투.',
  };
  return { title: info.title, description: info.description };
}

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
