"use client";
import { Cart, productOption, Product } from "@prisma/client";
import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

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

export default function CartList({ data }: CartListProps) {
  const [cart, setCart] = useState<CartWithProductOption[]>(data);

  const handleQuantityChange = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + delta,
              totalPrice: item.basePrice * (item.quantity + delta),
            }
          : item
      )
    );
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="flex flex-col gap-3">
      {cart.map((item) => (
        <div className="flex" key={item.id}>
          <div className="relative block w-28 h-28">
            {item.option.product.photo && (
              <Image
                src={`${item.option.product.photo}/public`}
                alt={item.option.product.photo}
                fill
                style={{ objectFit: "contain" }}
              />
            )}
          </div>
          <div className="w-full border-b border-b-gray-500">
            <div>상품명: {item.option.product.title}</div>
            <div>기본 가격: {formatToWon(item.option.product.price)}원</div>
            <div>기본 할인율: {item.option.product.discount}%</div>
            {item.option.plusdiscount ? (
              <div>추가 할인율: {item.option.plusdiscount}%</div>
            ) : null}
            <div>최종 가격: {formatToWon(item.totalPrice)}원</div>
            <div>색상: {item.option.color}</div>
            <div>구매수량: {item.quantity}</div>
            {/* <div>옵션수량: {item.option.quantity}</div> */}
            <button
              className="px-2 py-1 border border-gray-300"
              onClick={() => handleQuantityChange(item.id, -1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="mx-4">{item.quantity}</span>
            <button
              className="px-2 py-1 border border-gray-300"
              onClick={() => handleQuantityChange(item.id, 1)}
            >
              +
            </button>
          </div>
        </div>
      ))}
      <div className="total-price">총 가격: {formatToWon(totalPrice)}원</div>
    </div>
  );
}
