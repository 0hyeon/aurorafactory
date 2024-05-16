import Link from "next/link";
import React from "react";

export default function LeftMenu() {
  return (
    <div className="pl-4 fixed h-[100vh] top-0 pt-[80px] w-52 bg-slate-600 text-white">
      <ul>
        <li className="p-3 cursor-pointer">
          <Link href="/upload">업로드</Link>
        </li>
      </ul>
    </div>
  );
}
