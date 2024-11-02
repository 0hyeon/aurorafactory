"use client";
import {
  Cart,
  productOption,
  Product,
  User,
  productPicture,
} from "@prisma/client";
import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import Purchase from "./Purchase";
import { delCart } from "../actions";

interface ProductWithPicture extends Product {
  productPicture?: productPicture | null; // productPicture를 선택적으로 추가
}
interface ProductOptionWithProduct extends productOption {
  product: ProductWithPicture & { photo: string | null };
}
export interface CartWithProductOption {
  id: number;
  quantity: number;
  option: ProductOptionWithProduct;
  basePrice: number;
  totalPriceWithoutDelivery: number; // 배송비 제외 가격 추가
  totalPrice: number; // 배송비 포함 가격
}

interface CartListProps {
  data: any[];
  phone: string | null;
}

const calculateTotalPriceWithoutDelivery = (
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

const calculateTotalPrice = (
  basePrice: number,
  discount: string | number | null,
  plusDiscount: string | number | null,
  quantity: number,
  quantityInOption: number,
  deliverPrice: number
) => {
  const finalDiscount = (Number(discount) || 0) + (Number(plusDiscount) || 0);
  const discountedPrice = basePrice * (1 - finalDiscount / 100);
  return discountedPrice * quantity * quantityInOption + deliverPrice;
};

export default function CartList({ data, phone }: CartListProps) {
  console.log(data);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [vbankHolder, setVbankHolder] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [purchaseData, setPurchaseData] =
    useState<CartWithProductOption[]>(data);

  useEffect(() => {
    setPurchaseData(data);
  }, [data]);

  const [cart, setCart] = useState<CartWithProductOption[]>(() =>
    data.map((item) => ({
      ...item,
      totalPriceWithoutDelivery: calculateTotalPriceWithoutDelivery(
        item.basePrice,
        item.option.product.discount,
        item.option.plusdiscount,
        item.quantity,
        item.option.quantity
      ),
      totalPrice: calculateTotalPrice(
        item.basePrice,
        item.option.product.discount,
        item.option.plusdiscount,
        item.quantity,
        item.option.quantity,
        item.option.product.deliver_price
      ),
    }))
  );
  const isPurchaseDisabled = () => {
    if (paymentMethod === "vbank") {
      return !vbankHolder || !phoneNumber || !isPhoneNumberValid(phoneNumber);
    }
    return !paymentMethod;
  };

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPaymentMethod(event.target.value);
    if (event.target.value !== "vbank") {
      setVbankHolder(""); // 가상계좌가 아닐 경우 사용자명 초기화
    }
  };

  const handleRemoveItem = async (id: number) => {
    if (confirm("장바구니에서 제거하시겠습니까?")) {
      const result = await delCart({ id });

      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
      alert(result?.message);
    }

    // getCachedCartCount();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const isPhoneNumberValid = (number: string) => {
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(number);
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + delta,
              totalPriceWithoutDelivery: calculateTotalPriceWithoutDelivery(
                item.basePrice,
                item.option.product.discount,
                item.option.plusdiscount,
                item.quantity + delta,
                item.option.quantity
              ),
              totalPrice: calculateTotalPrice(
                item.basePrice,
                item.option.product.discount,
                item.option.plusdiscount,
                item.quantity + delta,
                item.option.quantity,
                item.option.product.deliver_price
              ),
            }
          : item
      )
    );
  };

  const totalDeliveryPrice = cart.reduce(
    (acc, item) => acc + item.option.product.deliver_price,
    0
  );
  const totalPriceWithoutDelivery = cart.reduce(
    (acc, item) => acc + item.totalPriceWithoutDelivery,
    0
  );
  const totalPrice = totalPriceWithoutDelivery + totalDeliveryPrice;

  return (
    <div className="flex flex-col gap-8 max-w-[1100px] mx-auto">
      {data.length !== 0 ? (
        <>
          {cart.map((item) => (
            <div className="flex" key={item.id}>
              <div className="relative block w-56 h-56 flex-grow-0 mr-6">
                {item.option.product.photo && (
                  <Image
                    src={`${item.option.product.productPicture?.photo}/public`}
                    alt={item.option.product.photo}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                )}
              </div>
              <div className="border-b border-b-gray-500 flex-grow">
                <div className="flex flex-col items-start justify-around h-full pl-3">
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex gap-12">
                      <div>
                        <div className="font-bold text-lg mb-4">
                          상품명: {item.option.product.title}
                        </div>
                        <div className="flex">
                          개당가격:
                          <span className="flex gap-2 items-center">
                            <span className="line-through text-lg">
                              {formatToWon(item.option.product.price)}
                            </span>
                            <span className="font-bold text-lg">
                              {formatToWon(
                                item.option.product.price -
                                  Number(item.option.product.discount)
                              )}
                              원
                            </span>
                          </span>
                        </div>
                        <div>옵션수량: {item.option.quantity}</div>
                        <div>색상: {item.option.color}</div>
                        <div>구매수량: {item.quantity}</div>
                        <div className="my-4 font-bold text-lg">
                          가격: {formatToWon(item.totalPrice)}원
                        </div>
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
                        <span className="mx-4 font-bold">{item.quantity}</span>
                        <button
                          className="px-4 py-2 border border-gray-300"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center">
                        배송비: {formatToWon(item.option.product.deliver_price)}
                        원
                      </div>
                      <div>
                        <button
                          className="px-4 py-2 border border-gray-300 bg-black text-white"
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
          <div className="flex items-center justify-between">
            <div className="">
              <div className="my-12 flex flex-col">
                <label className="text-lg font-bold mb-2">
                  결제 방법을 선택하세요:
                </label>
                <select
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">선택하세요</option>
                  <option value="cardAndEasyPay">
                    신용카드 (카카오페이/네이버페이/삼성페이)
                  </option>
                  <option value="vbank">가상계좌</option>
                  <option value="bank">계좌이체</option>
                  <option value="cellphone">휴대폰결제</option>
                  <option value="payco">PAYCO</option>
                </select>
              </div>
              {paymentMethod === "vbank" && (
                <div className="mt-4">
                  <label className="text-lg font-bold mb-2">입금자명:</label>
                  <input
                    type="text"
                    value={vbankHolder}
                    onChange={(e) => setVbankHolder(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full mb-10"
                    maxLength={40}
                    placeholder="입금자성명"
                  />
                  <label className="text-lg font-bold mb-2">핸드폰 번호:</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                    maxLength={11}
                    placeholder="01012345678"
                  />
                </div>
              )}
            </div>

            <div>
              <div className="my-2 text-lg">
                <div className="flex ">
                  상품가격: {formatToWon(totalPriceWithoutDelivery)}원
                </div>
                <div>배송비: {formatToWon(totalDeliveryPrice)}원</div>
              </div>
              <div className="total-price text-2xl font-semibold">
                총 가격: {formatToWon(totalPrice)}원
              </div>
            </div>
          </div>
          <Purchase
            data={purchaseData}
            method={paymentMethod}
            vbankHolder={vbankHolder}
            totalPrice={totalPrice}
            phone={phone}
            phoneNumber={phoneNumber}
            disabled={isPurchaseDisabled()}
          />
        </>
      ) : (
        <div className="text-center text-xl text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          장바구니가 비었습니다.
        </div>
      )}
    </div>
  );
}
