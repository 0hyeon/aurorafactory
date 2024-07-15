"use client";
import React, { useState } from "react";
import { cartCreate } from "../action";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
interface CartButtonProps {
  options: { id: number; quantity: number }[];
  cartId: number;
}

const CartButton = ({ options, cartId }: CartButtonProps) => {
  const [isCartAdded, setIsCartAdded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleAddToCart = async () => {
    const responses = await Promise.all(
      options.map(({ id, quantity }) =>
        cartCreate({ quantity, cartId, optionId: id })
      )
    );
    const notLoggedIn = responses.some(
      (response) => response.message === "로그인 후 이용해주세요"
    );
    const alreadyInCart = responses.every(
      (response) => response.message === "이미 장바구니에 담긴 상품입니다"
    );
    const addedToCart = responses.some((response) => response.ok);
    if (responses.length === 0) {
      alert("옵션을 선택해주세요.");
      return;
    }

    if (!notLoggedIn) {
      alert("로그인 후 이용해주세요");
      return; // Do not proceed with setting `isCartAdded`
    }

    if (alreadyInCart) {
      setPopupMessage("이미 장바구니에 담긴 상품입니다");
      setShowPopup(true);
      return;
    }

    if (addedToCart) {
      const messages = responses.map((response) => response.message).join("\n");
      setPopupMessage(messages);
      setShowPopup(true);
      setIsCartAdded(true); // Activate the purchase button only if some options are successfully added
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <button
        onClick={handleAddToCart}
        className="w-full p-4 bg-white hover:bg-blue-400 hover:text-white text-blue-400 rounded-md border-gray-400 border font-semibold text-base hover:border-blue-400 duration-300"
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
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-10 rounded-md shadow-md text-center w-[450px] z-10">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-center justify-center gap-3">
                <ShoppingCartIcon className="h-10" />
                <p className="font-semibold text-lg">{popupMessage}</p>
              </div>

              <div className="mt-4 flex justify-center gap-5">
                <button
                  onClick={handleClosePopup}
                  className="p-3 text-base bg-gray-200 rounded min-w-20"
                >
                  닫기
                </button>
                <Link href="/cart">
                  <button className="p-3 text-base bg-blue-400 text-white rounded min-w-20">
                    장바구니 바로가기
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="fixed inset-0" onClick={handleClosePopup}></div>
        </div>
      )}
    </div>
  );
};

export default CartButton;
