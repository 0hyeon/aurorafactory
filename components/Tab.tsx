"use client";
import React, { useState } from "react";
import Best from "./Best";
import { TabValue } from "@/types/type";
import { slideData } from "@/static/data";
import { cls } from "@/lib/utils";

const Tabs = () => {
  const [method, setMethod] = useState<TabValue>("또박케어LAB");
  const onClickOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.currentTarget.innerText);
    setMethod(e.currentTarget.innerText as TabValue);
  };
  const tabBase =
    "w-38 p-4 text-2xl cursor-pointer flex justify-center items-center h-full relative  text-center leading-tight transition-transform duration-200";

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
        </div>
      </div>
      {method && (
        <Best data={slideData.filter((el) => el.category === method)} />
      )}
    </>
  );
};

export default Tabs;
