"use client";
import React, { useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Scrollbar, Autoplay, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
export default function SlideSmall() {
  const [swiperIndex, setSwiperIndex] = useState(0); //페이지네이션
  const [swiper, setSwiper] = useState<SwiperClass>(); //슬라이드
  SwiperCore.use([Scrollbar, Autoplay, Pagination]);

  const slideData = [
    {
      id: 1,
      text: "오로라팩",
      src: "/images/middle_banner_1_2.jpg",
    },
    {
      id: 1,
      text: "오로라팩",
      src: "/images/middle_banner_1.png",
    },
  ];
  return (
    <div className="">
      <Swiper
        loop={true} // 슬라이드 루프
        spaceBetween={50} // 슬라이스 사이 간격
        slidesPerView={1} // 보여질 슬라이스 수
        autoplay={{
          delay: 2500,
          disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
        }}
      >
        {slideData.map((slide, idx) => (
          <div
            key={idx}
            className="w-full max-w-[1000px] mt-[40px] mb-[80px] mx-auto h-[180px] overflow-hidden"
          >
            <SwiperSlide key={slide.id}>
              <div style={{ height: 180 }}>
                <Image
                  alt={String(slide.id)}
                  src={slide.src}
                  fill={true}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </SwiperSlide>
          </div>
        ))}
      </Swiper>
    </div>
  );
}
