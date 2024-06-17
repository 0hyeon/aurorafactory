"use client";
import React, { useState } from "react";
import { formatToWon } from "@/lib/utils";
import Slide from "../../components/slide";
import CartButton from "./cart";
import SelectComponent from "@/components/select-bar";
import { Product, productOption } from "@prisma/client";

interface ProductDetailClientProps {
  product: Product & {
    user: {
      username: string;
      avatar: string | null; // Allow avatar to be nullable
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

const ProductDetailClient = ({ product, params }: ProductDetailClientProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const handleOptionSelect = (optionDetails: string, price: string) => {
    setSelectedOption(optionDetails);
    setCalculatedPrice(price);
  };
  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
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

            {selectedOption && (
              <>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">선택된 옵션</h2>
                  <div className="mt-2">{selectedOption}</div>
                  <div className="flex items-center mt-4">
                    <button
                      className="px-2 py-1 border border-gray-300"
                      onClick={decrementQuantity}
                    >
                      -
                    </button>
                    <span className="mx-4">{quantity}</span>
                    <button
                      className="px-2 py-1 border border-gray-300"
                      onClick={incrementQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="pt-10">
                  {params && <CartButton quantity={quantity} cartId={params} />}
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
