"use client";
import React, { useState } from "react";
import Slide from "../../components/slide";
import CartButton from "./cart";
import { formatToWon } from "@/lib/utils";
import SelectComponent from "@/components/select-bar";

interface ProductDetailClientProps {
  product: {
    id: number;
    title: string;
    price: number;
    photo: string;
    description: string;
    category: string;
    discount: string | null;
    created_at: Date;
    updated_at: Date;
    userId: number;
    user: {
      username: string;
      avatar: string | null;
    };
    slideimages: {
      id: number;
      src: string;
      createdAt: Date;
      updatedAt: Date;
      productId: number;
    }[];
    productoption: {
      id: number;
      productId: number;
      quantity: number | null;
      color: string | null;
      plusdiscount: number | null;
      created_at: Date;
      updated_at: Date;
    }[];
  };
  params: number;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  params,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [calculatedPrice, setCalculatedPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const handleOptionSelect = (
    optionDetails: string,
    price: string,
    pdOptionId: number
  ) => {
    if (
      selectedOptions.length > 0 &&
      selectedOptions.some((option) => option.id === pdOptionId)
    ) {
      alert("이미 선택된 옵션입니다.");
      return;
    }
    setSelectedOptions((prevOptions) => [
      ...prevOptions,
      { optionDetails, price, id: pdOptionId, quantity: 1 },
    ]);
  };

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
      const optionPrice = parseInt(option.price.replace(/[^0-9]/g, ""), 10);
      return total + optionPrice * option.quantity;
    }, 0);
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto">
      <div className="flex gap-[50px] pt-[60px]">
        <div className="w-[500px]">
          <div className="relative aspect-square">
            <Slide data={product} />
          </div>
        </div>
        <div className="w-[550px]">
          <div className="p-5">
            <div className="pb-[18px] px-[5px] border-b border-[#d5dbdc]">
              <h1 className="text-3xl font-medium tracking-[-.06em]">
                {product.title}
              </h1>
            </div>
            <div className="pt-3 pb-[18px] px-[5px] border-b border-[#d5dbdc]">
              <div className="flex items-center gap-2">
                <div className="font-medium text-sm line-through text-gray-500">
                  {formatToWon(product.price)}원
                </div>
                <div className="font-semibold text-xl text-orange-600">
                  {`${product.discount}%`}
                </div>
              </div>
              <div className="font-extrabold text-xl">
                {formatToWon(
                  product.price * (1 - Number(product.discount) / 100)
                )}
                원
              </div>
              <div className="text-base pt-3 flex items-center gap-2">
                {product.category}
                <div className="text-sm">원산지: 국내산</div>
              </div>
            </div>
            <div className="py-[28px] text-base">{product.description}</div>
            <div className="pb-[18px] px-[5px] border-b border-[#d5dbdc]">
              <SelectComponent
                options={product.productoption}
                price={product.price}
                discount={Number(product.discount)}
                quantity={quantity}
                onSelect={handleOptionSelect}
              />
            </div>

            {selectedOptions.length > 0 && (
              <>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">선택된 옵션</h2>
                  <div className="mt-2">
                    {selectedOptions.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div>{option.optionDetails}</div>
                        <div className="flex items-center mt-4">
                          <button
                            className="px-2 py-1 border border-gray-300"
                            onClick={() => handleQuantityChange(option.id, -1)}
                            disabled={option.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-4">{option.quantity}</span>
                          <button
                            className="px-2 py-1 border border-gray-300"
                            onClick={() => handleQuantityChange(option.id, 1)}
                          >
                            +
                          </button>
                          <button
                            className="ml-4 px-2 py-1 border border-gray-300 text-red-600"
                            onClick={() => handleRemoveOption(option.id)}
                          >
                            x
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 font-extrabold text-xl">
                    총 가격: {formatToWon(getTotalPrice())}원
                  </div>
                  <div className="pt-10">
                    {params && (
                      <CartButton options={selectedOptions} cartId={params} />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
