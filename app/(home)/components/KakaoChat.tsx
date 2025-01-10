"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const KakaoChat = () => {
  return (
    <>
      <Link
        href="http://pf.kakao.com/_yqxijK/chat"
        target="_blank"
        className="fixed z-[999] bottom-[6%] right-[4%] block w-16 h-16 mb-4"
      >
        <Image
          src={`/images/kakao.png`}
          alt={"카카오상담"}
          fill
          style={{ objectFit: "contain" }}
        />
      </Link>
    </>
  );
};

export default KakaoChat;
