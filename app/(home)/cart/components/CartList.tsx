"use client";
import { Cart, productOption, Product } from "@prisma/client";
import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import Purchase from "./Purchase";
import { delCart } from "../action";

interface ProductOptionWithProduct extends productOption {
  product: Product & { photo: string | null };
}
export interface CartWithProductOption {
  id: number;
  quantity: number;
  option: ProductOptionWithProduct;
  basePrice: number;
  totalPrice: number;
}

interface CartListProps {
  data: CartWithProductOption[];
}

const calculateTotalPrice = (
  basePrice: number,
  discount: string | number | null,
  plusDiscount: string | number | null,
  quantity: number,
  quantityInOption: number
) => {
  const finalDiscount = (Number(discount) || 0) + (Number(plusDiscount) || 0);
  const discountedPrice = basePrice * (1 - finalDiscount / 100);
  return discountedPrice * quantity * quantityInOption;
};

const dicountedPrice = ({ item }: { item: any }) => {
  const plusDiscount = Number(item.option.plusdiscount);
  const discountPercent = Number(item.option.product.discount);
  const objdiscount = 1 - (plusDiscount + discountPercent) / 100;
  return item.basePrice * objdiscount;
};

export default function CartList({ data }: CartListProps) {
  console.log("CartList :", data);
  console.log(data.length);
  const [cart, setCart] = useState<CartWithProductOption[]>(() =>
    data.map((item) => ({
      ...item,
      totalPrice: calculateTotalPrice(
        item.basePrice,
        item.option.product.discount,
        item.option.plusdiscount,
        item.quantity,
        item.option.quantity
      ),
    }))
  );

  const handleQuantityChange = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + delta,
              totalPrice: calculateTotalPrice(
                item.basePrice,
                item.option.product.discount,
                item.option.plusdiscount,
                item.quantity + delta,
                item.option.quantity
              ),
            }
          : item
      )
    );
  };

  const handleRemoveItem = async (id: number) => {
    if (confirm("장바구니에서 제거하시겠습니까?")) {
      const result = await delCart({ id });

      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
      alert(result?.message);
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="flex flex-col gap-8">
      {data.length !== 0 ? (
        <>
          {cart.map((item) => (
            <div className="flex" key={item.id}>
              <div className="relative block w-56 h-56 flex-grow-0">
                {item.option.product.photo && (
                  <Image
                    src={`${item.option.product.photo}/public`}
                    alt={item.option.product.photo}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                )}
              </div>
              <div className="border-b border-b-gray-500 flex-grow">
                <div className="flex flex-col items-start justify-around h-full">
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex gap-12">
                      <div>
                        <div className="font-bold text-lg">
                          상품명: {item.option.product.title}
                        </div>
                        <div className="flex">
                          가격:
                          <span className="flex gap-2">
                            <span className="line-through">
                              {formatToWon(item.option.product.price)}
                            </span>
                            {formatToWon(dicountedPrice({ item }))}원
                          </span>
                        </div>
                        <div>색상: {item.option.color}</div>
                        <div>구매수량: {item.quantity}</div>
                        <div>옵션수량: {item.option.quantity}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center px-10 gap-12">
                      <div className="flex items-center">
                        <button
                          className="px-4 py-2 border border-gray-300"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-4">{item.quantity}</span>
                        <button
                          className="px-4 py-2 border border-gray-300"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center">
                        가격: {formatToWon(item.totalPrice)}원
                      </div>
                      <div>
                        <button
                          className="px-4 py-2  border border-gray-300 bg-black text-white"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="total-price text-2xl font-semibold">
            총 가격: {formatToWon(totalPrice)}원
          </div>
          <Purchase data={cart} />
        </>
      ) : (
        <>
          <div className="text-center text-xl text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            장바구니가 비었습니다.
          </div>
        </>
      )}
    </div>
  );
}
