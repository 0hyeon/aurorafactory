"use client";
import React from "react";
import Link from "next/link";
export default function HashTag() {
  return (
    <div className="my-8 px-1 py-2 md:my-[60px] md:py-[35px] md:px-[85px] bg-[#eef3f8]">
      {/* flex-wrap 추가로 두 줄 가능 */}
      <ul className="flex flex-wrap gap-[10px]">
        <li className="text-base flex-[1_1_30%] md:flex-1 underline">
          <Link
            className="p-[8px] text-[#000] text-center shadow-md bg-white rounded-[25px] font-medium md:text-base text-[13px] flex items-center justify-center"
            href={"/productlist/lame"}
          >
            #라미봉투
          </Link>
        </li>
        <li className="text-base flex-[1_1_30%] md:flex-1 underline">
          <Link
            className="p-[8px] text-[#000] text-center shadow-md bg-white rounded-[25px] font-medium md:text-base text-[13px] flex items-center justify-center"
            href={"/productlist/aircap"}
          >
            #뽁뽁이
          </Link>
        </li>
        <li className="text-base flex-[1_1_30%] md:flex-1 underline">
          <Link
            className="p-[8px] text-[#000] text-center shadow-md bg-white rounded-[25px] font-medium md:text-base text-[13px] flex items-center justify-center"
            href={"/productlist/eunbak"}
          >
            #보냉봉투
          </Link>
        </li>
        <li
          onClick={() => alert("준비중입니다.")}
          className="flex-[1_1_30%] md:flex-1 underline p-[8px] text-[#000] text-center shadow-md bg-white rounded-[25px] font-medium md:text-base text-[13px] flex items-center justify-center cursor-pointer"
        >
          #안전봉투
        </li>
        <li
          onClick={() => alert("준비중입니다.")}
          className="flex-[1_1_30%] md:flex-1 underline p-[8px] text-[#000] text-center shadow-md bg-white rounded-[25px] font-medium md:text-base text-[13px] flex items-center justify-center cursor-pointer"
        >
          #PE폼
        </li>
        <li className="text-base flex-[1_1_30%] md:flex-1 list-none underline">
          <Link
            className="p-[8px] text-[#000] text-center shadow-md bg-white rounded-[25px] font-medium md:text-base text-[13px] flex items-center justify-center"
            href={"/productlist/all"}
          >
            #전체상품
          </Link>
        </li>
      </ul>
    </div>
  );
}
