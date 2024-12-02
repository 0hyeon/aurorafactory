"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, Autoplay, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
export default function Slide() {
  const [swiperIndex, setSwiperIndex] = useState(0); //페이지네이션
  const [swiper, setSwiper] = useState<SwiperClass>(); //슬라이드
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 확인
  useEffect(() => {
    // 브라우저 환경에서만 실행
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // 초기값 설정
    window.addEventListener("resize", handleResize); // 창 크기 변경 이벤트 등록

    return () => {
      window.removeEventListener("resize", handleResize); // 이벤트 제거
    };
  }, []);
  const handlePrev = () => {
    swiper?.slidePrev();
  };
  const handleNext = () => {
    swiper?.slideNext();
  };
  SwiperCore.use([Navigation, Scrollbar, Autoplay, Pagination]);
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return (
        '<span class=" navi-wrap ' + className + '">' + (index + 1) + "</span>"
      );
    },
  };
  const slideData = [
    {
      id: 1,
      text: "오로라팩",
      src: "/images/main_banner5.jpg",
      mobileSrc: "/images/mobile_banner1.png",
    },
    {
      id: 2,
      text: "오로라팩",
      src: "/images/main_banner1.png",
      mobileSrc: "/images/mobile_banner2.jpg",
    },
  ];
  return (
    <div>
      <Swiper
        loop={true}
        spaceBetween={isMobile ? 50 : 10}
        slidesPerView={1}
        navigation={true}
        autoplay={{
          delay: 4200,
          disableOnInteraction: false,
        }}
        onActiveIndexChange={(e) => setSwiperIndex(e.realIndex)}
        onSwiper={(e) => {
          setSwiper(e);
        }}
      >
        {slideData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-[240px] md:h-[360px]">
              <Image
                alt={String(slide.id)}
                src={isMobile ? slide.mobileSrc : slide.src}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="relative w-full max-w-[1000px] mx-auto font-normal">
        {/* 네비게이션 컨트롤 */}
        <div className="absolute z-[1] flex right-0 md:right-4 left-0 md:left-[inherit] bottom-4 mx-auto md:mx-0 text-white rounded-[100px] w-[70px] md:w-[110px] py-1 md:py-2 text-sm md:text-base justify-around items-center bg-[rgba(0,0,0,0.5)]">
          <div
            className="w-6 h-6 md:w-8 md:h-8 cursor-pointer bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: "url('/images/left.png')" }}
            onClick={handlePrev}
          ></div>
          <div className="flex gap-1">
            <span>{swiperIndex + 1}</span>
            <span>{"/"}</span>
            <span>{slideData.length}</span>
          </div>
          <div
            className="w-6 h-6 md:w-8 md:h-8 cursor-pointer bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: "url('/images/right.png')" }}
            onClick={handleNext}
          ></div>
        </div>
      </div>
    </div>
  );
}
