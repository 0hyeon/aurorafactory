import Link from "next/link";
import React from "react";

export default function LeftMenu() {
  return (
    <div className="pl-4 fixed h-[100vh] top-0 pt-[80px] w-52 bg-slate-600 text-white">
      <ul>
        <li className="p-3 cursor-pointer">
          <Link href="/admin/upload">업로드</Link>
        </li>
        <li className="p-3 cursor-pointer">
          <Link href="/admin/option">수량옵션</Link>
        </li>
        <li className="p-3 cursor-pointer">
          <Link href="/admin/common">사진등록</Link>
        </li>
      </ul>
    </div>
  );
}
