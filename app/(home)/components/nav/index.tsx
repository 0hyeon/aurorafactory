"use client";
// import styles from "./style.module.scss";
import { useState } from "react";
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
  {
    title: "Shop",
    href: "/shop",
    src: "shop.png",
  },
  {
    title: "About Us",
    href: "/about",
    src: "home.png",
  },
  {
    title: "Lookbook",
    href: "/lookbook",
    src: "lookbook.png",
  },
  {
    title: "Contact",
    href: "/contact",
    src: "contact.png",
  },
];

export default function Nav() {
  const [selectedLink, setSelectedLink] = useState({
    isActive: false,
    index: 0,
  });

  return (
    <motion.div
      variants={height}
      initial="initial"
      animate="enter"
      exit="exit"
      className="flex justify-between absolute"
    >
      <div
        className="
            flex
            flex-col
            justify-between"
      >
        <Body
          links={links}
          selectedLink={selectedLink}
          setSelectedLink={setSelectedLink}
        />
        {/* <Footer /> */}
      </div>
      <Image
        src={links[selectedLink.index].src}
        isActive={selectedLink.isActive}
        alt="image"
      />
    </motion.div>
  );
}
