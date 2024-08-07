"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { opacity } from "./anim";
import Image from "next/image";
import Nav from "./nav";
import { getCachedCartCount } from "./action";

export default function Header({ cookies }: any) {
  const [isActive, setIsActive] = useState(false);
  const [cartCount, setCartCount] = useState<any>(0);
  console.log("cookies : ", cookies);

  // fetchCartCount 함수 정의
  const fetchCartCount = async () => {
    try {
      const count = await getCachedCartCount(); // cookies를 getCachedCartCount에 전달
      setCartCount(count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0); // 에러 발생 시 기본값 설정
    }
  };

  useEffect(() => {
    fetchCartCount(); // 마운트 시 초기 장바구니 개수 가져오기

    const handleCartUpdated = () => {
      fetchCartCount(); // 이벤트 발생 시 장바구니 개수 다시 가져오기
    };

    // 이벤트 리스너 등록
    window.addEventListener("cartUpdated", handleCartUpdated);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [cookies]); // cookies가 변경될 때 다시 가져오기

  return (
    <div className="max-w-[1100px] my-0 mx-auto relative">
      <div className="flex items-center justify-between">
        <div className="">
          <Image
            src={`/images/btn_halfttobak.0d0c008c.gif`}
            width={270}
            height={48}
            alt="eventImage"
          />
        </div>
        <Link href="/">
          <Image
            src={`/images/aurora_logo.jpg`}
            width={300}
            height={100}
            alt="logoImage"
          />
        </Link>
        <motion.div
          variants={opacity}
          animate={!isActive ? "open" : "closed"}
          className="w-[270px] flex flex-col justify-center items-end"
        >
          <Link href={"/cart"}>
            <div className="flex gap-[10px]">
              <svg
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.66602 1.66667H2.75449C2.9595 1.66667 3.06201 1.66667 3.1445 1.70437C3.2172 1.73759 3.2788 1.79102 3.32197 1.85829C3.37096 1.93462 3.38546 2.0361 3.41445 2.23905L3.80887 5M3.80887 5L4.68545 11.4428C4.79669 12.2604 4.85231 12.6692 5.04777 12.977C5.22 13.2481 5.46692 13.4637 5.75881 13.5978C6.09007 13.75 6.50264 13.75 7.32777 13.75H14.4593C15.2448 13.75 15.6375 13.75 15.9585 13.6087C16.2415 13.4841 16.4842 13.2832 16.6596 13.0285C16.8585 12.7397 16.9319 12.3539 17.0789 11.5823L18.1819 5.79141C18.2337 5.51984 18.2595 5.38405 18.222 5.27792C18.1892 5.18481 18.1243 5.1064 18.039 5.05668C17.9417 5 17.8035 5 17.527 5H3.80887ZM8.33268 17.5C8.33268 17.9602 7.95959 18.3333 7.49935 18.3333C7.03911 18.3333 6.66602 17.9602 6.66602 17.5C6.66602 17.0398 7.03911 16.6667 7.49935 16.6667C7.95959 16.6667 8.33268 17.0398 8.33268 17.5ZM14.9993 17.5C14.9993 17.9602 14.6263 18.3333 14.166 18.3333C13.7058 18.3333 13.3327 17.9602 13.3327 17.5C13.3327 17.0398 13.7058 16.6667 14.166 16.6667C14.6263 16.6667 14.9993 17.0398 14.9993 17.5Z"
                  stroke="#4D3D30"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <p>Cart({cartCount ? cartCount : 0})</p>
            </div>
          </Link>
        </motion.div>
      </div>
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
        <div>드시모네</div>
        <div>오투부스터</div>
        <div>또박케어LAB</div>
        <div>또박배송</div>
        <div>이벤트/혜택</div>
        <div>커뮤니티</div>
        <div>고객센터</div>
      </div>
      <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
    </div>
  );
}
