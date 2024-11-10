"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Purchase from "./Purchase";
import { delCart } from "../actions";
import AddressSearch from "@/components/address";
import { formatToWon } from "@/lib/utils";
import { OptionSchemaAddress } from "../schema";

interface CartListProps {
  data: any[];
  phone: string | null;
  address: string;
}

interface AddressData {
  address: string;
  postaddress: string;
  detailaddress: string;
}

interface ValidationState {
  error: {
    fieldErrors: {
      address?: string[];
      postaddress?: string[];
      detailaddress?: string[];
    };
  };
}

const calculateTotalPrice = (
  basePrice: number,
  discount: number,
  plusDiscount: number,
  quantity: number,
  quantityInOption: number,
  deliverPrice: number = 0
) => {
  const finalDiscount = discount + plusDiscount;
  const discountedPrice = basePrice * (1 - finalDiscount / 100);
  return discountedPrice * quantity * quantityInOption + deliverPrice;
};

export default function CartList({ data, phone, address }: CartListProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [vbankHolder, setVbankHolder] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("existing");
  const [newAddress, setNewAddress] = useState<string>("");
  const [addressData, setAddressData] = useState<AddressData>({
    address: "",
    postaddress: "",
    detailaddress: "",
  });
  const [state, setState] = useState<ValidationState>({ error: { fieldErrors: {} } });
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    setCart(
      data.map((item) => ({
        ...item,
        totalPrice: calculateTotalPrice(
          item.basePrice,
          Number(item.option.product.discount) || 0,
          Number(item.option.plusdiscount) || 0,
          item.quantity,
          item.option.quantity,
          item.option.product.deliver_price || 0
        ),
      }))
    );
  }, [data]);

  useEffect(() => {
    if (selectedAddress === "new") {
      const result = OptionSchemaAddress.safeParse(addressData);
      setState({
        error: {
          fieldErrors: result.success
            ? {}
            : result.error.errors.reduce((acc, err) => {
                acc[err.path[0] as keyof AddressData] = [err.message];
                return acc;
              }, {} as ValidationState["error"]["fieldErrors"]),
        },
      });
    }
  }, [selectedAddress, addressData]);

  const isPhoneNumberValid = (number: string) => /^010\d{8}$/.test(number);

  const handleRemoveItem = async (id: number) => {
    if (confirm("장바구니에서 제거하시겠습니까?")) {
      await delCart({ id });
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + delta,
              totalPrice: calculateTotalPrice(
                item.basePrice,
                Number(item.option.product.discount) || 0,
                Number(item.option.plusdiscount) || 0,
                item.quantity + delta,
                item.option.quantity,
                item.option.product.deliver_price || 0
              ),
            }
          : item
      )
    );
  };

  const isPurchaseDisabled = () => {
    const addressValid =
      selectedAddress === "existing" ||
      (selectedAddress === "new" &&
        addressData.address &&
        addressData.postaddress &&
        addressData.detailaddress);
    const paymentValid =
      paymentMethod &&
      (paymentMethod === "vbank"
        ? vbankHolder && phoneNumber && isPhoneNumberValid(phoneNumber)
        : true);
    return !(addressValid && paymentValid);
  };

  const totalDeliveryPrice = cart.reduce(
    (acc, item) => acc + (item.option.product.deliver_price || 0),
    0
  );
  const totalPriceWithoutDelivery = cart.reduce(
    (acc, item) => acc + item.totalPrice - (item.option.product.deliver_price || 0),
    0
  );
  const totalPrice = totalPriceWithoutDelivery + totalDeliveryPrice;
  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPaymentMethod(event.target.value);
    if (event.target.value !== "vbank") {
      setVbankHolder(""); // 가상계좌가 아닐 경우 사용자명 초기화
    }
  };
  return (
    <div className="flex flex-col gap-8 max-w-[1100px] mx-auto">
      {cart.length > 0 ? (
        <>
          {cart.map((item) => (
            <div className="flex" key={item.id}>
              <div className="relative block w-56 h-56 flex-grow-0 mr-6">
                {item.option.product.productPicture?.photo && (
                  <Image
                    src={`${item.option.product.productPicture.photo}/public`}
                    alt="Product image"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                )}
              </div>
              <div className="border-b border-b-gray-500 flex-grow pl-3">
                <div className="font-bold text-lg mb-4">{item.option.product.title}</div>
                <div className="flex">개당가격: {formatToWon(item.basePrice)}원</div>
                <div>구매수량: {item.quantity}</div>
                <div>가격: {formatToWon(item.totalPrice)}원</div>
                <button
                  className="px-4 py-2 border border-gray-300 bg-black text-white"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  X
                </button>
              </div>
            </div>
          ))}
          <div className="flex gap-10">
            <div className="my-4 w-1/2">
            <div>
              <label className="text-lg font-bold mb-2">
                결제 방법을 선택하세요:
              </label>
              <select
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                className="p-2 border border-gray-300 rounded w-full"
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
            <div className="my-4 w-1/2">
            <div className="mb-6">
              <label className="text-lg font-bold mb-2">배송주소 :</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="address"
                    value="existing"
                    checked={selectedAddress === "existing"}
                    onChange={() => setSelectedAddress("existing")}
                  />
                  기존주소 사용
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="address"
                    value="new"
                    checked={selectedAddress === "new"}
                    onChange={() => setSelectedAddress("new")}
                  />
                  새로운주소 입력
                </label>
              </div>
            </div>
              <div className="flex flex-col gap-5">

              {selectedAddress === "new" ? (
                <AddressSearch addressData={addressData} setAddressData={setAddressData} state={state} />
              ) : ( <input
                type="text"
                value={address || ""}
                readOnly
                onChange={(e) => setNewAddress(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full mt-4"
              />)}
              </div>
            </div>
          </div>
          <Purchase
            data={cart}
            method={paymentMethod}
            vbankHolder={vbankHolder}
            address={ addressData.address + addressData.detailaddress + addressData.postaddress || ''}
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
