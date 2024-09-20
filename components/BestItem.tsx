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
import { Product } from "@prisma/client";

export default function BestItem({
  data,
  title = "인기상품",
  subtitle = "제품보호를위한",
}: any) {
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
        '<span class=" navi-wrap ' + className + '">' + (index + 1) + "</span>"
      );
    },
  };
  const DiscountPrice = (per: number, price: number): number => {
    const minusNumber = 1 - per / 100;
    const result = price * minusNumber;
    return result;
  };
  return (
    <div>
      <div className="flex gap-5 pt-[100px] pb-[18px] items-end">
        <h3 className="text-black text-3xl font-bold">{title}</h3>
        <h1 className=" text-[#999] text-sm font-medium">{subtitle}</h1>
      </div>
      <div className="cursor-pointer">
        <Swiper
          loop={true} // 슬라이드 루프
          spaceBetween={150} // 슬라이스 사이 간격
          slidesPerView={4} // 보여질 슬라이스 수
          navigation={true} // prev, next button
          autoplay={{
            delay: 4000,
            disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
          }}
          onActiveIndexChange={(e) => setSwiperIndex(e.realIndex)}
          onSwiper={(e) => {
            setSwiper(e);
          }}
        >
          {data &&
            data.map((slide: any) => (
              <div key={slide.id} className="">
                <SwiperSlide key={slide.id}>
                  <Link
                    href={`/products/${slide.id}`}
                    style={{ textDecoration: "none", color: "unset" }}
                  >
                    <div className="relative w-[260px] h-[260px] object-contain">
                      <Image
                        alt={String(slide.id)}
                        src={`${slide.photo}/public`}
                        className="object-contain rounded-2xl border border-gray-400"
                        fill
                      />
                    </div>
                    <div className="">
                      <div>{slide.title}</div>
                      <div className="flex pt-[10px] items-center">
                        <div className="text-lg text-[#999] line-through pr-[10px]">
                          {slide.price.toLocaleString("ko-kr")}원
                        </div>
                        <div className="text-2xl text-[#111] font-bold">
                          {DiscountPrice(
                            Number(slide.discount),
                            slide.price
                          ).toLocaleString("ko-kr")}
                          원
                        </div>
                      </div>
                      {/* <div className="text-base text-left">
                      (리뷰{slide.reviews}개)
                    </div> */}
                    </div>
                  </Link>
                </SwiperSlide>
              </div>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
