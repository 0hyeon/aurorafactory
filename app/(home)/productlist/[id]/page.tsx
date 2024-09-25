import React from "react";
import { getCachedProducts } from "../../products/[id]/page";

type Mapping = {
  [key: string]: string;
};
const ProductListPage = async ({ params }: { params: { id: string } }) => {
  const category = params.id;

  // 함수 정의: title은 string, 리턴 타입도 string
  const mappingSubtitle = (item: string): string => {
    const mapping: Mapping = {
      lame: "발포지",
      aircap: "에어캡봉투",
      eunbak: "은박봉투",
    };

    return mapping[item];
  };

  const items = await getCachedProducts();

  return (
    <div>
      {items
        .filter((el) => el.category === mappingSubtitle(category))
        .map((el) => {
          return (
            <div key={el.id}>
              <div>{el.id}</div>
              <div>{el.title}</div>
              <div>{el.price}</div>
              <div>{el.category}</div>
            </div>
          );
        })}
    </div>
  );
};

export default ProductListPage;
