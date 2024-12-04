"use client";
// import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { height } from "../anim";
import Body from "./Body";
import Footer from "./Footer";
import Image from "./Image";

const links = [
  {
    title: "Home",
    href: "/",
    src: "home.png",
  },
  // {
  //   title: "Shop",
  //   href: "/shop",
  //   src: "shop.png",
  // },
  // {
  //   title: "About Us",
  //   href: "/about",
  //   src: "home.png",
  // },
  {
    title: "에어캡봉투",
    href: "/productlist/aircap",
    src: "lookbook.png",
  },
  {
    title: "보냉봉투",
    href: "/productlist/eunbak",
    src: "contact.png",
  },
  {
    title: "라미봉투",
    href: "/productlist/lame",
    src: "contact.png",
  },
];

export default function Nav() {
  const [selectedLink, setSelectedLink] = useState({
    isActive: false,
    index: 0,
  });
  const [isMobile, setIsMobile] = useState(false);
  // fetchCartCount 함수 정의
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // 초기값 설정
    window.addEventListener("resize", handleResize); // 창 크기 변경 이벤트 등록

    return () => {
      window.removeEventListener("resize", handleResize); // 이벤트 제거
    };
  }, []);
  return (
    <motion.div
      variants={height}
      initial="initial"
      animate="enter"
      exit="exit"
      className="w-full top-0 flex h-full justify-between absolute z-[5] bg-white pb-16"
    >
      <div className="flex flex-col justify-between w-full">
        <Body
          links={links}
          selectedLink={selectedLink}
          setSelectedLink={setSelectedLink}
        />
        {/* <Footer /> */}
      </div>
      {!isMobile && (
        <Image
          src={links[selectedLink.index].src}
          isActive={selectedLink.isActive}
          alt="image"
        />
      )}
    </motion.div>
  );
}
