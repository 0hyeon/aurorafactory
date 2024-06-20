"use client";
import React, { useState } from "react";
import { cartCreate } from "../action";
import Link from "next/link";

interface CartButtonProps {
  options: { id: number; quantity: number }[];
  cartId: number;
}

const CartButton: React.FC<CartButtonProps> = ({ options, cartId }) => {
  const [isCartAdded, setIsCartAdded] = useState(false);

  const handleAddToCart = async () => {
    const responses = await Promise.all(
      options.map(({ id, quantity }) =>
        cartCreate({ quantity, cartId, optionId: id })
      )
    );
    const messages = responses.map((response) => response.message).join("\n");
    alert(messages);
    setIsCartAdded(true); // Activate the purchase button
  };

  return (
    <div>
      <button
        onClick={handleAddToCart}
        className="w-1/2 p-3 bg-white hover:bg-blue-400 hover:text-white text-blue-400 rounded-md border-gray-400 border font-semibold text-base hover:border-blue-400 duration-300"
      >
        장바구니담기
      </button>
      {isCartAdded && (
        <Link href="/cart">
          <button className="w-1/2 p-3 bg-blue-400 text-white rounded-md border-gray-400 border font-semibold text-base hover:border-blue-400 duration-300 mt-4">
            구매하러가기
          </button>
        </Link>
      )}
    </div>
  );
};

export default CartButton;
