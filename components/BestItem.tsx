"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, Autoplay, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
        loop={true} // 슬라이드 루프
        spaceBetween={isMobile ? 10 : 150} // 모바일에서 20, 데스크탑에서 150 간격
        slidesPerView={isMobile ? 2 : 4} // 모바일에서는 2개, 데스크탑에서는 4개씩 보여줌
        navigation={!isMobile} // 모바일에서는 네비게이션 버튼 비활성화
        autoplay={{
          delay: 4000,
          disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
        }}
        onActiveIndexChange={(e) => setSwiperIndex(e.realIndex)}
        onSwiper={(e) => setSwiper(e)}
      >
        {data?.map((slide: any) => (
          <SwiperSlide
            key={slide.id}
            className="flex justify-center"
            style={{
              width: isMobile
                ? `calc((100% - ${20 * 2}px) / 2)` // 간격을 고려해 슬라이드 크기 계산
                : "auto",
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
                    ? "w-[calc((100vw-60px)/2)] h-[calc((100vw-60px)/2)]" // 모바일: 정사각형
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
              <div className={`pt-3 ${isMobile ? "text-sm" : ""}`}>
                <div>{slide.title}</div>
                <div className="flex pt-[10px] items-center">
                  {/* 기존 가격 */}
                  <div
                    className={`${
                      isMobile
                        ? "text-base text-gray-500 pr-2"
                        : "text-lg text-[#999] line-through pr-[10px]"
                    }`}
                  >
                    {slide.price.toLocaleString("ko-KR")}원
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
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
