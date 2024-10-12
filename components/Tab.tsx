"use client";
import React, { useEffect, useState } from "react";
import Best from "./Best";
import { IProduct, TabValue } from "@/types/type";
import { slideData } from "@/static/data";
import { cls } from "@/lib/utils";
import ListProduct from "./list-product";
import ProductList from "./productList";
import { getCachedProducts } from "@/app/(home)/products/[id]/page";
import BestItem from "./BestItem";
import { Product } from "@prisma/client";
import { mappingSubDesc } from "@/app/(home)/productlist/[id]/actions";

const Tabs = () => {
  const [method, setMethod] = useState<TabValue>("라미봉투");
  const [isData, setData] = useState<IProduct[]>([]);
  // const onClickOpen = (e: React.MouseEvent<HTMLDivElement>) => {
  //   console.log(e.currentTarget.innerText);
  //   setMethod(e.currentTarget.innerText as TabValue);
  // };
  const onClickOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    const newMethod = e.currentTarget.innerText as TabValue;
    // 상태가 변경될 때만 업데이트
    if (newMethod !== method) {
      setMethod(newMethod);
    }
  };
  const fetchData = async () => {
    const products = await getCachedProducts(); // 메서드에 따라 제품 가져오기
    setData(products); // 상태 업데이트
  };

  type Mapping = {
    [key: string]: string;
  };

  // 함수 정의: title은 string, 리턴 타입도 string

  useEffect(() => {
    fetchData(); // 컴포넌트가 마운트될 때 데이터 가져오기
  }, [method]);
  const tabBase =
    "w-38 p-4 text-base cursor-pointer flex justify-center items-center h-full relative  text-center leading-tight transition-transform duration-200";

  const tabDefault = "text-gray-500 font-normal";

  const tabOn = "text-blue-600 font-bold border-b-[2px] border-blue-600";
  return (
    <>
      <div className="flex flex-wrap justify-center py-0 px-p[12px] border-b border-b-[#909090] m-b-[20px] items-center m-b[50px]">
        <div className="flex">
          <div
            className={`${tabBase} ${
              method === "라미봉투" ? tabOn : tabDefault
            }`}
            onClick={onClickOpen}
          >
            라미봉투
          </div>
          <div
            className={`${tabBase} ${
              method === "보냉봉투" ? tabOn : tabDefault
            }`}
            onClick={onClickOpen}
          >
            보냉봉투
          </div>
          <div
            className={`${tabBase} ${
              method === "에어캡봉투" ? tabOn : tabDefault
            }`}
            onClick={onClickOpen}
          >
            에어캡봉투
          </div>
        </div>
      </div>
      {method === "드시모네" || method === "또박케어LAB" ? (
        <Best data={slideData.filter((el) => el.category === method)} />
      ) : (
        <BestItem
          data={isData.filter((el) => el.productPicture?.category === method)}
          title={method}
          subtitle={mappingSubDesc(method)}
        />
      )}
    </>
  );
};

export default Tabs;
