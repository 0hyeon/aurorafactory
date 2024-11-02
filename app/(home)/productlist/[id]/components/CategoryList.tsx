"use client";
import React, { useEffect, useState } from "react";
import { mappingSubDesc, mappingSubtitle } from "../actions";
import { IProduct, LameBagValue } from "@/types/type";
import Image from "next/image";
import Link from "next/link";

const CategoryList = ({
  itemsCategory,
  category,
}: {
  itemsCategory: IProduct[];
  category: string;
}) => {
  const tabBase =
    "w-28 p-2 text-base cursor-pointer flex justify-center items-center h-full relative text-center leading-tight transition-all duration-200";

  const tabDefault = "text-gray-500 font-normal";

  const tabOn =
    "text-blue-600 font-bold border-2 rounded-full border-blue-600 transition-all duration-200 transform translate-y-[-5px]";

  const onClickOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    setMethod(e.currentTarget.innerText);
  };
  const categories = [...new Set(itemsCategory.map((el) => el.category))].sort(
    (a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      return numA - numB; // 오름차순 정렬
    }
  );
  const [method, setMethod] = useState<any>(
    categories.length > 0 ? categories[0] : ""
  );
  return (
    <>
      <div className="mb-2 border-b p-3 m-3">
        {mappingSubtitle(category) === "라미봉투" ||
        mappingSubtitle(category) === "보냉봉투" ? (
          <div className="py-12 flex flex-wrap justify-center px-p[12px] m-b-[20px] items-center m-b[50px]">
            <div className="flex gap-3">
              {categories.map((category) => (
                <div
                  key={category} // 각 카테고리에 대해 고유한 key 추가
                  className={`${tabBase} ${
                    method === category ? tabOn : tabDefault
                  }`}
                  onClick={onClickOpen}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="flex gap-3 items-end">
          <h3 className="text-black text-3xl font-bold">
            {mappingSubtitle(category)}
          </h3>
          <h1 className=" text-[#999] text-lg font-medium">
            {mappingSubDesc(mappingSubtitle(category))}
          </h1>
        </div>
      </div>

      {mappingSubtitle(category) === "라미봉투" ||
      mappingSubtitle(category) === "보냉봉투" ? (
        <div className="grid grid-cols-3 gap-4 w-11/12 mx-auto">
          {itemsCategory &&
            itemsCategory
              .filter((el) => el.category === method)
              .map((el) => (
                <Link
                  href={`/products/${el.id}`}
                  style={{ textDecoration: "none", color: "unset" }}
                  key={el.id}
                >
                  <div className="p-4">
                    <div className="relative block w-full aspect-[12/12] flex-grow-0">
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
                      <span className="text-lg font-bold">
                        {Number(el.price)}원
                      </span>
                    </div>
                    <div className="text-center mt-6 text-sm text-[#333]">
                      (리뷰 0개)
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 w-11/12 mx-auto">
          {itemsCategory &&
            itemsCategory.map((el) => (
              <Link
                href={`/products/${el.id}`}
                style={{ textDecoration: "none", color: "unset" }}
                key={el.id}
              >
                <div className="p-4">
                  <div className="relative block w-full aspect-[12/12] flex-grow-0">
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
                    <span className="text-lg font-bold">
                      {Number(el.price)}원
                    </span>
                  </div>
                  <div className="text-center mt-6 text-sm text-[#333]">
                    (리뷰 0개)
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default CategoryList;
