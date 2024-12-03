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
    // 화면 크기를 감지하여 모바일 여부를 설정
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 768px 이하를 모바일로 간주
    };

    handleResize(); // 초기값 설정
    window.addEventListener("resize", handleResize); // 화면 크기 변경 감지

    return () => window.removeEventListener("resize", handleResize);
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
            {isMobile ? (
              // 모바일일 때 레이아웃
              <div className="relative w-full aspect-[375/314] flex justify-center items-center bg-gray-100">
                <Image
                  alt={String(slide.id)}
                  src={slide.mobileSrc}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
            ) : (
              // PC일 때 레이아웃
              <div className="relative w-full h-[240px] md:h-[360px]">
                <Image
                  alt={String(slide.id)}
                  src={slide.src}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
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
