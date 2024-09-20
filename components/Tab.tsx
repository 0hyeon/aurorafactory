"use client";
import React, { useEffect, useState } from "react";
import Best from "./Best";
import { TabValue } from "@/types/type";
import { slideData } from "@/static/data";
import { cls } from "@/lib/utils";
import ListProduct from "./list-product";
import ProductList from "./productList";
import { getProducts } from "@/app/(home)/products/[id]/page";
import BestItem from "./BestItem";

const Tabs = () => {
  const [method, setMethod] = useState<TabValue>("또박케어LAB");
  const [isData, setData] = useState<any>([]);
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
    const products = await getProducts(); // 메서드에 따라 제품 가져오기
    setData(products); // 상태 업데이트
  };
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
              method === "드시모네" ? tabOn : tabDefault
            }`}
            onClick={onClickOpen}
          >
            드시모네
          </div>
          <div
            className={`${tabBase} ${
              method === "또박케어LAB" ? tabOn : tabDefault
            }`}
            onClick={onClickOpen}
          >
            또박케어LAB
          </div>
          <div
            className={`${tabBase} ${
              method === "라미봉투" ? tabOn : tabDefault
            }`}
            onClick={onClickOpen}
          >
            라미봉투
          </div>
        </div>
      </div>
      {method === "드시모네" || method === "또박케어LAB" ? (
        <Best data={slideData.filter((el) => el.category === method)} />
      ) : (
        <BestItem data={isData} title={"라미봉투"} />
      )}
    </>
  );
};

export default Tabs;
