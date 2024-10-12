"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { opacity } from "./anim";
import Nav from "./nav";
export default function Menu() {
  const [isActive, setIsActive] = useState<boolean>(false);
  return (
    <>
      <div className="flex justify-between pb-4">
        {/* Menu */}
        <div
          onClick={() => {
            setIsActive(!isActive);
          }}
          className="flex items-center justify-center gap-2 cursor-pointer"
        >
          <div className="relative">
            <motion.p
              variants={opacity}
              animate={!isActive ? "open" : "closed"}
            >
              Menu
            </motion.p>
            <motion.p
              variants={opacity}
              className="absolute opacity-0 top-0"
              animate={isActive ? "open" : "closed"}
            >
              Close
            </motion.p>
          </div>
        </div>
        <div>라미봉투</div>
        <div>보냉봉투</div>
        <div>에어캡봉투</div>
        <div>발포시트지</div>
        <div>이벤트/혜택</div>
        <div>커뮤니티</div>
        <div>고객센터</div>
      </div>
      <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
    </>
  );
}
