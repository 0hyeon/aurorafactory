import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className="fixed z-10 w-full text-white bg-slate-600 p-4 h-[48px]">
      <Link href="/">오로라팩</Link>
    </div>
  );
}
