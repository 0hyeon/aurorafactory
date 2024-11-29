import Button from "@/components/button";
import { NullableProduct } from "@/types/type";
import Image from "next/image";
import React from "react";

const ProductBox = ({
  el,
  onModifyClick,
}: {
  el: NullableProduct;
  onModifyClick: (id: number | undefined) => void;
}) => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* 이미지 영역 */}
      <div className="relative w-full h-80">
        {el?.productPicture?.photo ? (
          <Image
            src={`${el.productPicture.photo}/public`}
            alt={el.productPicture.photo || ""}
            fill
            className="object-contain rounded-t-lg"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-t-lg">
            <span className="text-gray-500">이미지 없음</span>
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{el?.title}</h3>

        {/* 가격 영역 */}
        <div className="mt-2 text-lg font-bold text-green-600">
          {el?.price
            ? `가격: ${el.price.toLocaleString()}원`
            : "가격 정보 없음"}
        </div>

        {/* 설명 영역 */}
        <p className="mt-2 text-gray-600 text-sm">{el?.description}</p>

        {/* 할인 정보 */}
        <div className="mt-2 text-sm text-red-600 font-semibold">
          {el?.discount ? `할인: ${el.discount}%` : "할인 정보 없음"}
        </div>

        {/* 카테고리 */}
        <div className="mt-2 text-sm text-gray-500">
          카테고리: {el?.category || "카테고리 정보 없음"}
        </div>
        <div className="mt-5 flex items-center justify-between mb-6">
          <Button onClick={() => onModifyClick(el?.id)} text="상품 수정" />
        </div>
      </div>
    </div>
  );
};
export default ProductBox;
