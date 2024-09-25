"use client";
import React, { useEffect, useState } from "react";
import Best from "./Best";
import { TabValue } from "@/types/type";
import { slideData } from "@/static/data";
import { cls } from "@/lib/utils";
import ListProduct from "./list-product";
import ProductList from "./productList";
import { getCachedProducts } from "@/app/(home)/products/[id]/page";
import BestItem from "./BestItem";
import { Product } from "@prisma/client";

const Tabs = () => {
  const [method, setMethod] = useState<TabValue>("발포지");
  const [isData, setData] = useState<Product[]>([]);
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
  const mappingSubtitle = (title: string): string => {
    const mapping: Mapping = {
      발포지: "가성비ㆍ탁월한",
      에어캡봉투: "완충효과 100%",
      은박봉투: "온도유지",
    };

    return mapping[title] || "default";
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
            className={`${tabBase} ${method === "발포지" ? tabOn : tabDefault}`}
            onClick={onClickOpen}
          >
            발포지
          </div>
          <div
            className={`${tabBase} ${
              method === "은박봉투" ? tabOn : tabDefault
            }`}
            onClick={onClickOpen}
          >
            은박봉투
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
          data={isData.filter((el) => el.category === method)}
          title={method}
          subtitle={mappingSubtitle(method)}
        />
      )}
    </>
  );
};

export default Tabs;
