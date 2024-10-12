"use client";
import React, { useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, Autoplay, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

import Link from "next/link";
import { IslideData } from "@/types/type";

export default function Slide({ data }: { data: any }) {
  const [swiperIndex, setSwiperIndex] = useState(0); //페이지네이션
  const [swiper, setSwiper] = useState<SwiperClass>(); //슬라이드
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
        '<span class="!w-5 !h-5 !bg-black border-2 border-[#ddd] navi-wrap ' +
        className +
        '">' +
        // (index + 1) +
        "</span>"
      );
    },
  };
  const DiscountPrice = (per: number, price: number): number => {
    const minusNumber = 1 - per / 100;
    const result = price * minusNumber;
    return result;
  };
  return (
    <div className="cursor-pointer">
      <Swiper
        loop={true} // 슬라이드 루프
        spaceBetween={50} // 슬라이스 사이 간격
        slidesPerView={1} // 보여질 슬라이스 수
        navigation={true} // prev, next button
        autoplay={{
          delay: 4000,
          disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
        }}
        pagination={pagination}
        onActiveIndexChange={(e) => setSwiperIndex(e.realIndex)}
        onSwiper={(e) => {
          setSwiper(e);
        }}
      >
        {data.productPicture.photo && (
          <SwiperSlide key="main-photo">
            <div className="relative w-[500px] h-[500px]">
              <Image
                alt="main-photo"
                src={`${data.productPicture.photo}/public`}
                fill
                className="object-contain"
                placeholder="blur"
                blurDataURL={`${data.productPicture.photo}/public`}
              />
            </div>
          </SwiperSlide>
        )}
        {data &&
          data.productPicture.slideimages.map((slide: any) => (
            <div key={slide.id} className="">
              <SwiperSlide key={slide.id}>
                <div className="relative w-[500px] h-[500px]">
                  <Image
                    alt={String(slide.id)}
                    src={`${slide.src}/public`}
                    fill
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            </div>
          ))}
      </Swiper>
    </div>
  );
}
