"use client";
import React from "react";
import Link from "next/link";
export default function HashTag() {
  return (
    <>
      <div className="my-[60px] py-[35px] px-[85px] bg-[#eef3f8]">
        <ul className="flex gap-[10px]">
          <li className="text-base flex-1 underline">
            <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/productlist/lame"}
            >
              #라미봉투
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/productlist/aircap"}
            >
              #뽁뽁이
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/productlist/eunbak"}
            >
              #보냉봉투
            </Link>
          </li>
          <li
            onClick={() => alert("준비중입니다.")}
            className="text-base flex-1 underline p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium cursor-pointer"
          >
            {/* <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/productlist/anjeon"}
            > */}
            #안전봉투
            {/* </Link> */}
          </li>
          <li
            onClick={() => alert("준비중입니다.")}
            className="text-base flex-1 underline p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium cursor-pointer"
          >
            {/* <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/productlist/peform"}
            > */}
            #PE폼
            {/* </Link> */}
          </li>
          <li className="text-base flex-1 list-none underline">
            <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/productlist/all"}
            >
              #전체상품
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
