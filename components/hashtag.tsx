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
              href={"/발포지"}
            >
              #발포지
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/뽁뽁이"}
            >
              #뽁뽁이
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/보냉봉투"}
            >
              #보냉봉투
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/안전봉투"}
            >
              #안전봉투
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/PE폼"}
            >
              #PE폼
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/날개달린발포지"}
            >
              #날개달린발포지
            </Link>
          </li>
          <li className="text-base flex-1 list-none underline">
            <Link
              className="p-[8px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium"
              href={"/전체상품"}
            >
              #전체상품
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
