"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Scrollbar,
  Autoplay,
  Pagination,
  Grid,
} from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import Image from "next/image";

import Link from "next/link";
import { IProduct, IslideData } from "@/types/type";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import {
  mappingSubtitle,
  mappingtitle,
} from "@/app/(home)/productlist/[id]/actions";
interface NullableProduct {
  data: IProduct[] | undefined;
  title: string;
  subtitle: string;
}
export default function BestItem({ data, title, subtitle }: NullableProduct) {
  const [swiperIndex, setSwiperIndex] = useState(0); //페이지네이션
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 확인

  const [swiper, setSwiper] = useState<SwiperClass>(); //슬라이드
  const handlePrev = () => {
    swiper?.slidePrev();
  };
  const handleNext = () => {
    swiper?.slideNext();
  };
  SwiperCore.use([Scrollbar, Autoplay, Pagination, Grid]);
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
    <div className="cursor-pointer">
      <div className="flex pt-[100px] pb-[18px] items-end justify-between">
        <div className="flex gap-3 justify-between items-end">
          <h3 className="text-black text-3xl font-bold">{title}</h3>
          <h1 className=" text-[#999] text-lg font-medium">{subtitle}</h1>
        </div>
        <Link
          href={`/productlist/${
            mappingtitle(title) === undefined ? "all" : mappingtitle(title)
          }`}
          className=""
        >
          <div className="cursor-pointer text-gray-700 pr-4">
            <ArrowRightIcon className="h-8" />
          </div>
        </Link>
      </div>
      <Swiper
        loop={data && data.length > 4} // 데이터가 충분할 때만 루프 활성화
        spaceBetween={isMobile ? 10 : 150}
        slidesPerView={isMobile ? 2 : 4}
        grid={data && data.length > 0 ? { rows: 2, fill: "row" } : undefined}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        onActiveIndexChange={(e: any) => setSwiperIndex(e.realIndex)}
        onSwiper={(e: any) => setSwiper(e)}
        modules={[Grid]}
        // pagination={{
        //   clickable: true,
        // }}
        navigation={!isMobile}
      >
        {data?.map((slide: any, index: number) => (
          <SwiperSlide
            key={slide.id}
            className="flex justify-center"
            style={{
              width: isMobile ? "50%" : "auto", // 모바일: 슬라이드 50% 크기
            }}
          >
            <Link
              href={`/products/${slide.id}`}
              className="block flex-shrink-0 no-underline text-inherit"
            >
              {/* 이미지 영역 */}
              <div
                className={`relative ${
                  isMobile
                    ? "w-[calc(50vw-55px)] h-[calc(50vw-55px)]" // 모바일: 정사각형 비율
                    : "w-[260px] h-[260px]" // 데스크탑: 고정 크기
                }`}
              >
                <Image
                  alt={`Image of ${slide.id}`}
                  src={`${slide.productPicture.photo}/public`}
                  className="object-cover rounded-2xl border border-gray-400"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              {/* 텍스트 영역 */}
              <div
                className={`w-full pt-3 ${
                  isMobile ? "text-sm" : "min-w-[260px]"
                }`}
              >
                <div className="w-full">{slide.title}</div>
                <div className="flex pt-[10px] items-center">
                  {/* 기존 가격 */}
                  <div
                    className={`${
                      isMobile
                        ? "text-base text-gray-500 pr-2"
                        : "text-lg text-[#999] line-through pr-[10px]"
                    }`}
                  >
                    {Math.floor(slide.price.toLocaleString("ko-KR") * 1.1)}원
                  </div>
                  {/* 할인된 가격 */}
                  <div
                    className={`${
                      isMobile
                        ? "text-lg text-[#111] font-semibold"
                        : "text-2xl text-[#111] font-bold"
                    }`}
                  >
                    {DiscountPrice(
                      Number(slide.discount),
                      slide.price
                    ).toLocaleString("ko-KR")}
                    원
                  </div>
                </div>
                {slide._count.cart > 0 ? (
                  <div>구매건수 : 🔥{slide._count.cart}</div>
                ) : null}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
