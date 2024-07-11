"use client";
import { Cart, productOption, Product } from "@prisma/client";
import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import Purchase from "./Purchase";

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
  console.log("datacart : ", data);
  const [cart, setCart] = useState<CartWithProductOption[]>(data);

  const handleQuantityChange = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + delta,
              totalPrice:
                item.basePrice * (item.quantity + delta) * item.option.quantity,
            }
          : item
      )
    );
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.totalPrice * item.option.quantity,
    0
  );

  return (
    <div className="flex flex-col gap-3">
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
            <div className="flex flex-col">
              <div>
                <div>상품명: {item.option.product.title}</div>
                <div>
                  가격:{" "}
                  <span className="line-through">
                    {formatToWon(item.option.product.price)}
                  </span>{" "}
                  {formatToWon(item.totalPrice)}원
                </div>
                <div>색상: {item.option.color}</div>
                <div>구매수량: {item.quantity}</div>
                <div>옵션수량: {item.option.quantity}</div>{" "}
                {/* null 체크 제거 */}
              </div>
              <div>
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
            </div>
          </div>
        </div>
      ))}
      <div className="total-price text-2xl font-semibold">
        총 가격: {formatToWon(totalPrice)}원
      </div>
      <Purchase data={""} />
    </div>
  );
}
