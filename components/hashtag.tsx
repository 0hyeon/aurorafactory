import React from "react";
import Link from "next/link";
export default function HashTag() {
  return (
    <>
      <div className="my-[60px] py-[35px] px-[85px] bg-[#eef3f8]">
        <ul className="flex gap-[10px]">
          <li className="text-base flex-1 underline">
            <Link className="p-[10px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium" href={"/유산균"}>
              #유산균
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link className="p-[10px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium" href={"/멀티팩"}>
              #멀티팩
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link className="p-[10px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium" href={"/오메가3"}>
              #오메가3
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link className="p-[10px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium" href={"/관절건강"}>
              #관절건강
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link className="p-[10px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium" href={"/간건강"}>
              #간건강
            </Link>
          </li>
          <li className="text-base flex-1 underline">
            <Link className="p-[10px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium" href={"/눈건강"}>
              #눈건강
            </Link>
          </li>
          <li className="text-base flex-1 list-none underline">
            <Link className="p-[10px] text-[#999] block text-center shadow-md bg-white rounded-[25px] font-medium" href={"/멀티비타민"}>
              #멀티비타민
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};