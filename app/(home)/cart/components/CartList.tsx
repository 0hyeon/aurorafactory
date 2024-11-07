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
  address: string;
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

export default function CartList({ data, phone, address }: CartListProps) {
  console.log("address : ", address);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [vbankHolder, setVbankHolder] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("existing"); // New state for address selection
  const [newAddress, setNewAddress] = useState<string>(""); // New state for entering new address

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
    const addressValid =
      selectedAddress === "new" ? newAddress : selectedAddress === "existing";
    if (paymentMethod === "vbank") {
      return (
        !vbankHolder ||
        !phoneNumber ||
        !isPhoneNumberValid(phoneNumber) ||
        !addressValid
      );
    }
    return !paymentMethod || !addressValid;
  };

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPaymentMethod(event.target.value);
    if (event.target.value !== "vbank") {
      setVbankHolder(""); // Reset holder name if not using virtual bank
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
              {/* Product information and remove button */}
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
              <div className="my-4">
                <label className="text-lg font-bold mb-2">
                  배송 주소 선택:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="address"
                      value="existing"
                      checked={selectedAddress === "existing"}
                      onChange={() => setSelectedAddress("existing")}
                    />
                    기존 배송주소 사용
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="address"
                      value="new"
                      checked={selectedAddress === "new"}
                      onChange={() => setSelectedAddress("new")}
                    />
                    새로운 배송주소 입력
                  </label>
                </div>
                {selectedAddress === "new" ? (
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full mt-4"
                    placeholder="새로운 배송 주소를 입력하세요"
                  />
                ) : (
                  <input
                    type="text"
                    value={address || ""}
                    readOnly
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full mt-4"
                  />
                )}
              </div>
            </div>

            <div>{/* Price summary */}</div>
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
