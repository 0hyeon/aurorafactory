"use client";
import React, { useCallback, useEffect, useState } from "react";
import Slide from "../../components/slide";
import CartButton from "./cart";
import { formatToWon } from "@/lib/utils";
import SelectComponent from "@/components/select-bar";
import { User, productOption, slideImage } from "@prisma/client";
import Purchase from "@/app/(home)/cart/components/Purchase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IProduct } from "@/types/type";

interface ProductDetailClientProps {
  product: IProduct;
  params: number;
}
interface CartButtonProps {
  options: { id: number; quantity: number }[];
  cartId: number;
}

const ProductDetailClient = ({ product, params }: ProductDetailClientProps) => {
  console.log("product : ", product);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleOptionSelect = useCallback(
    (
      optionDetails: string,
      price: string,
      pdOptionId: number,
      dummycount: number
    ) => {
      if (isNaN(pdOptionId)) {
        return;
      }
      setSelectedOptions((prevOptions) => {
        const isOptionAlreadySelected = prevOptions.some(
          (option) => option.id === pdOptionId
        );
        if (isOptionAlreadySelected) {
          setAlertMessage("이미 선택된 옵션입니다.");
          return prevOptions;
        }
        return [
          ...prevOptions,
          {
            optionDetails,
            price,
            id: pdOptionId,
            quantity: 1, //초기세팅
            dummycount: dummycount,
          },
        ];
      });
    },
    []
  );

  useEffect(() => {
    if (alertMessage !== null) {
      alert(alertMessage);
      setAlertMessage(null);
    }
  }, [alertMessage]);

  const handleQuantityChange = (optionId: number, change: number) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === optionId
          ? { ...option, quantity: option.quantity + change }
          : option
      )
    );
  };

  const handleRemoveOption = (optionId: number) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.filter((option) => option.id !== optionId)
    );
  };

  const getTotalPrice = () => {
    return selectedOptions.reduce((total, option) => {
      // price를 먼저 숫자로 변환합니다.
      const optionPrice = parseFloat(option.price);
      // 각 옵션에 대해 quantity 및 dummycount를 곱합니다.
      return total + optionPrice * option.quantity * option.dummycount;
    }, 0);
  };
  return (
    <>
      <div className="flex flex-col md:flex-row gap-5 md:gap-[50px] max-w-[1100px] mx-auto border-b border-[#999] pb-10 md:pb-14">
        {/* 슬라이드 이미지 */}
        <div className="w-full md:w-[500px]">
          <div className="relative aspect-square">
            <Slide data={product} />
          </div>
        </div>
        {/* 상품 정보 */}
        <div className="w-full md:w-[550px]">
          <div className="p-5">
            {/* 상품 제목 */}
            <div className="pb-[12px] md:pb-[18px] px-[5px] border-b border-[#d5dbdc]">
              <h1 className="text-2xl md:text-3xl font-medium tracking-[-.06em]">
                {product.title}
              </h1>
            </div>
            {/* 가격 및 카테고리 */}
            <div className="pt-3 pb-[12px] md:pb-[18px] px-[5px] border-b border-[#d5dbdc]">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <div className="font-medium text-sm line-through text-gray-500">
                  {formatToWon(product.price)}원
                </div>
                <div className="font-semibold text-lg md:text-xl text-orange-600">
                  {product.discount ? `${product.discount}%` : ""}
                </div>
              </div>
              <div className="font-extrabold text-lg md:text-xl">
                {formatToWon(
                  product.discount
                    ? product.price * (1 - Number(product.discount) / 100)
                    : product.price
                )}
                원
              </div>
              <div className="text-sm md:text-base pt-3 flex flex-col md:flex-row items-start md:items-center gap-2">
                {product.category}
                <div className="text-xs md:text-sm">원산지: 국내산</div>
              </div>
            </div>
            {/* 설명 */}
            <div className="py-5 md:py-[28px] text-sm md:text-base">
              {product.description}
            </div>
            {/* 옵션 선택 */}
            <div className="pb-[18px] md:px-[5px] border-b border-[#d5dbdc]">
              <SelectComponent
                options={product.productoption}
                price={product.price}
                discount={Number(product.discount) || 0}
                quantity={quantity}
                onSelect={handleOptionSelect}
                selectedOptions={selectedOptions}
              />
            </div>
            {/* 선택된 옵션 */}
            {selectedOptions.length > 0 && (
              <>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">선택된 옵션</h2>
                  <div className="mt-2">
                    {selectedOptions.map((option, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0"
                      >
                        <div>{option.optionDetails}</div>
                        <div className="flex items-center mt-2 md:mt-4">
                          <button
                            className="px-2 py-1 border border-gray-300"
                            onClick={() => handleQuantityChange(option.id, -1)}
                            disabled={option.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2 md:mx-4">
                            {option.quantity}
                          </span>
                          <button
                            className="px-2 py-1 border border-gray-300"
                            onClick={() => handleQuantityChange(option.id, 1)}
                          >
                            +
                          </button>
                          <button
                            className="ml-2 md:ml-4 px-2 py-1 border border-gray-300 text-red-600"
                            onClick={() => handleRemoveOption(option.id)}
                          >
                            x
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 font-extrabold text-lg md:text-xl">
                    총 가격: {formatToWon(getTotalPrice())}원
                  </div>
                </div>
              </>
            )}
            {/* 버튼들 */}
            <div className="pt-6 md:pt-10 flex flex-col w-full gap-2">
              {params && (
                <CartButton
                  options={selectedOptions}
                  cartId={params}
                  text={"장바구니담기"}
                />
              )}
              {/* {params && (
                <CartButton
                  options={selectedOptions}
                  cartId={params}
                  text={"구매하기"}
                />
              )} */}
            </div>
          </div>
        </div>
      </div>
      {/* 이미지 */}
      <div className="relative block w-full md:w-[40%] mx-auto aspect-[1/10] overflow-hidden">
        {product && product.productPicture?.category && (
          <Image
            src={
              product.productPicture.category === "보냉봉투"
                ? "/images/BoNengDetail.jpg"
                : product.productPicture.category === "라미봉투"
                ? "/images/BpSangsaePage.jpg"
                : product.productPicture.category === "에어캡봉투"
                ? "/images/aircapDetail.jpg"
                : product.productPicture.category === "test2"
                ? "/images/BpSangsaePage.jpg"
                : ""
            }
            alt="상세페이지"
            fill
            placeholder="blur"
            className="object-cover"
            blurDataURL={
              product.productPicture.category === "보냉봉투"
                ? "/images/BoNengDetail.jpg"
                : product.productPicture.category === "라미봉투"
                ? "/images/BpSangsaePage.jpg"
                : product.productPicture.category === "에어캡봉투"
                ? "/images/aircapDetail.jpg"
                : product.productPicture.category === "test2"
                ? "/images/BpSangsaePage.jpg"
                : ""
            }
          />
        )}
      </div>
    </>
  );
};

export default ProductDetailClient;
