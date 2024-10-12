"use client";
import React from "react";
import { mappingSubDesc, mappingSubtitle } from "../actions";
import { IProduct } from "@/types/type";
import Image from "next/image";

const CategoryList = ({
  itemsCategory,
  category,
}: {
  itemsCategory: IProduct[];
  category: string;
}) => {
  return (
    <>
      <div className="mb-2 border-b p-3 m-3">
        <div className="flex gap-3 items-end">
          <h3 className="cursor-pointer text-black text-3xl font-bold">
            {mappingSubtitle(category)}
          </h3>
          <h1 className=" text-[#999] text-lg font-medium">
            {mappingSubDesc(mappingSubtitle(category))}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-11/12 mx-auto">
        {itemsCategory &&
          itemsCategory.map((el) => (
            <div key={el.id} className="p-4">
              <div className="relative block w-full aspect-[12/12] flex-grow-0">
                {/* 16:9 비율 유지 */}
                {el.productPicture?.photo && (
                  <Image
                    src={`${el.productPicture.photo}/public`}
                    className="object-cover rounded-2xl border border-gray-400"
                    alt={el.title}
                    fill
                    placeholder="blur"
                    blurDataURL={`${el.productPicture.photo}`}
                  />
                )}
              </div>
              <div className="text-center text-base font-medium pt-5 pb-2 text-[#333]">
                {el.title}
              </div>
              <div className="flex gap-3 text-center items-center justify-center">
                <span className="text-gray-500 line-through">
                  {Math.floor(Number(el.price) * 1.1)}원
                </span>
                <span className="text-lg font-bold">{Number(el.price)}원</span>
              </div>
              <div className="text-center mt-6 text-sm text-[#333]">
                (리뷰 0개)
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default CategoryList;
