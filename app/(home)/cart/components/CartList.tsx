"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Purchase from "./Purchase";
import { delCart } from "../actions";
import AddressSearch from "@/components/address";
import { formatToWon } from "@/lib/utils";
import { OptionSchemaAddress, OptionSchemaUser } from "../schema";
import { CartWithProductOption } from "../page";
import Link from "next/link";

interface CartListProps {
  data: CartWithProductOption[];
  phone: string | null;
  address: string;
  username: string;
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
  plusPrice: number,
  discount: number,
  plusDiscount: number,
  quantity: number,
  quantityInOption: number,
  deliverPrice: number = 0
) => {
  const totalPricePerUnit = (basePrice + plusPrice) * ((100 - discount) / 100);
  return (
    totalPricePerUnit *
    quantity *
    quantityInOption *
    ((100 - plusDiscount) / 100)
  );
  // return discountedPrice * quantity * quantityInOption + deliverPrice;
};

export default function CartList({
  data,
  phone,
  address,
  username,
}: CartListProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [vbankHolder, setVbankHolder] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("existing");
  const [selectedUser, setSelectedUser] = useState<string>("existing");
  const [newUsername, setNewUsername] = useState<string>("");
  const [newPhone, setNewPhone] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  const [addressData, setAddressData] = useState<AddressData>({
    address: "",
    postaddress: "",
    detailaddress: "",
  });
  const [state, setState] = useState<ValidationState>({
    error: { fieldErrors: {} },
  });
  const [cart, setCart] = useState<any[]>([]);
  useEffect(() => {
    setCart(
      data.map((item) => ({
        ...item,
        totalPrice: calculateTotalPrice(
          item.basePrice,
          Number(item.option.plusPrice) || 0, // 추가 금액
          Number(item.option.product.discount) || 0, // 기본 할인율
          Number(item.option.plusdiscount) || 0, // 추가 할인율
          item.quantity,
          item.option.quantity,
          item.option.deliver_price || 0 // 배송비
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

  useEffect(() => {
    if (selectedUser === "new") {
      const userValidationResult = OptionSchemaUser.safeParse({
        username: newUsername,
        phone: newPhone,
      });
      if (!userValidationResult.success) {
        console.log(userValidationResult.error.format());
      }
    }
  }, [selectedUser, newUsername, newPhone]);

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
      prevCart.map((item) => {
        if (item.id === id) {
          // 수량 업데이트
          const newQuantity = Math.max(item.quantity + delta, 1); // 최소 수량 1 유지

          // 총 가격 계산
          const newTotalPrice = calculateTotalPrice(
            item.basePrice,
            Number(item.option.plusPrice) || 0, // 추가 금액
            Number(item.option.product.discount) || 0, // 기본 할인율
            Number(item.option.plusdiscount) || 0, // 추가 할인율
            newQuantity, // 업데이트된 수량
            item.option.quantity,
            item.option.deliver_price || 0 // 배송비
          );

          // 수정된 아이템 반환
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newTotalPrice,
          };
        }
        return item; // 다른 아이템은 변경하지 않음
      })
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

    const userValid =
      selectedUser === "existing" ||
      (selectedUser === "new" && newUsername && isPhoneNumberValid(newPhone));

    return !(addressValid && paymentValid && userValid);
  };

  const totalDeliveryPrice = cart.reduce(
    //total deliver_price
    (acc, item) => acc + (item.option.deliver_price || 0),
    0
  );
  const maxDeliveryPrice = cart.reduce(
    //max deliver_price
    (max, item) => Math.max(max, item.option.deliver_price || 0),
    0
  );
  //배송비고려한
  // const totalPriceWithoutDelivery = cart.reduce(
  //   (acc, item) => acc + item.totalPrice - (item.option.deliver_price || 0),
  //   0
  // );
  const totalPriceWithoutDelivery = cart.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );
  // const totalPrice = totalPriceWithoutDelivery + totalDeliveryPrice;
  //배송비고려한
  const totalPrice = totalPriceWithoutDelivery + maxDeliveryPrice;
  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPaymentMethod(event.target.value);
    if (event.target.value !== "vbank") {
      setVbankHolder(""); // 가상계좌가 아닐 경우 사용자명 초기화
    }
  };
  return (
    <div className="flex flex-col gap-8 max-w-[1100px] mx-auto mt-7">
      {cart.length > 0 ? (
        <>
          {cart.map((item) => (
            <div className="border-b md:border-b-0 flex" key={item.id}>
              <div className="relative block w-[calc(65vw)] h-[calc(40vw)] md:w-56 md:h-56 flex-grow-0 md:mr-6">
                <Link href={`/products/${item.id}`}>
                  {item.option.product.productPicture?.photo && (
                    <Image
                      src={`${item.option.product.productPicture.photo}/public`}
                      alt="Product image"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </Link>
              </div>
              <div className="md:border-b border-b-gray-500 flex-grow md:pl-3 pl-4">
                <div className="flex items-center justify-between pr-[5%]">
                  <div className="">
                    <div className="font-bold md:text-lg text-sm mb-[5%]">
                      {item.option.product.title}
                    </div>
                    <div className="md:text-sm text-[12px] ">
                      개당가격:
                      {formatToWon(item.basePrice + item.option.plusPrice)}원
                    </div>
                    <div className="md:text-sm text-[12px] ">
                      구매수량:
                      {item.quantity * item.option.quantity}장
                    </div>
                    <div className="md:text-sm text-[12px] ">
                      가격:
                      {formatToWon(
                        item.quantity *
                          (item.basePrice + item.option.plusPrice) *
                          item.option.quantity
                      )}
                      원
                    </div>
                    {/* <div className="md:text-sm text-[12px] ">
                      배송비: {formatToWon(item.option.deliver_price)}
                    </div> */}
                    <div className="md:text-sm text-[12px] md:mt-5 mt-2">
                      추가할인:
                      {item.option.plusdiscount}%
                    </div>
                    <div className="font-bold md:text-sm text-sm">
                      {formatToWon(item.totalPrice | 0)}원
                    </div>
                    <div className="flex gap-2 my-3 items-center">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="px-3 py-1 border rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="px-3 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <button
                      className="px-[6px] py-[0px] md:px-3 md:py-1 border border-gray-300 bg-black text-white"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* 결제정보 */}
          <div className="flex md:gap-10 md:flex-row flex-col">
            <div className="my-2 md:my-4 md:w-1/2 w-full">
              <div className="flex flex-col  mb-3">
                <label className="md:mb-0 mb-2 text-sm md:text-lg font-bold">
                  결제 방법을 선택하세요:
                </label>
                <select
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  className="p-2 border border-gray-300 rounded w-full"
                >
                  <option value="">선택하세요</option>
                  <option value="cardAndEasyPay">
                    (신용카드/카카오페이/네이버페이/삼성페이)
                  </option>
                  <option value="vbank">가상계좌</option>
                  <option value="bank">계좌이체</option>
                  <option value="cellphone">휴대폰결제</option>
                  <option value="payco">PAYCO</option>
                </select>
              </div>
              {paymentMethod === "vbank" && (
                <div className="mt-4">
                  <label className="text-sm md:mb-3  md:text-lg font-bold mb-0">
                    입금자명:
                  </label>
                  <input
                    type="text"
                    value={vbankHolder}
                    onChange={(e) => setVbankHolder(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full mb-10"
                    maxLength={40}
                    placeholder="입금자성명"
                  />
                  <label className="text-sm md:mb-3  md:text-lg font-bold mb-0">
                    핸드폰 번호:
                  </label>
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
            <div className="my-2 md:my-4 md:w-1/2 w-full">
              <div className="md:mb-6 md:block md:gap-0 flex gap-4">
                <label className="text-sm md:mb-3 md:text-lg font-bold mt-2 md:mt-4">
                  배송주소 :
                </label>
                <div className="flex gap-4 mt-2 md:mt-4">
                  <label className="text-sm md:text-baseflex items-center gap-2">
                    <input
                      type="radio"
                      name="address"
                      value="existing"
                      checked={selectedAddress === "existing"}
                      onChange={() => setSelectedAddress("existing")}
                    />
                    기존주소 사용
                  </label>
                  <label className="text-sm md:text-baseflex items-center gap-2">
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
                  <AddressSearch
                    addressData={addressData}
                    setAddressData={setAddressData}
                    state={state}
                  />
                ) : (
                  <input
                    type="text"
                    value={address || ""}
                    readOnly
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full md:mt-4 mt-2"
                  />
                )}
              </div>
            </div>
            <div className="mt-4 md:w-1/2 w-full">
              <div className="md:mb-6 md:block md:gap-0 flex gap-4">
                <label className="text-sm mt-2 md:mb-3  md:text-lg font-bold mb-0">
                  받는 사람:
                </label>
                <div className="flex gap-4 mt-2 md:mt-4">
                  <label className="text-sm md:text-baseflex items-center gap-2">
                    <input
                      type="radio"
                      name="username"
                      value="existing"
                      checked={selectedUser === "existing"}
                      onChange={() => setSelectedUser("existing")}
                    />
                    받는사람
                  </label>
                  <label className="text-sm md:text-baseflex items-center gap-2">
                    <input
                      type="radio"
                      name="username"
                      value="new"
                      checked={selectedUser === "new"}
                      onChange={() => setSelectedUser("new")}
                    />
                    새 사용자명 입력
                  </label>
                </div>
              </div>
              {selectedUser === "existing" ? (
                <>
                  <input
                    type="text"
                    value={username || ""}
                    readOnly
                    className="p-2 border border-gray-300 rounded w-full md:mt-4 mt-2"
                    placeholder="기존 사용자명"
                  />
                  <input
                    type="tel"
                    value={phone || ""}
                    readOnly
                    className="p-2 border border-gray-300 rounded w-full md:mt-4 mt-2"
                    placeholder="기존 전화번호"
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full md:mt-4 mt-2"
                    placeholder="새 사용자명을 입력하세요"
                  />
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full md:mt-4 mt-2"
                    placeholder="01012345678"
                  />
                </>
              )}
            </div>
          </div>
          {/* 총합 및 결제 컴포넌트 */}
          <div className="md:my-10 flex justify-around items-center gap-1 md:gap-4 bg-white p-1 md:p-6 rounded-lg shadow-lg border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="text-gray-600 font-medium text-sm">상품가격</div>
              <div className="text-sm md:text-xl font-semibold text-gray-900 mt-1">
                {formatToWon(totalPriceWithoutDelivery)}원
              </div>
            </div>
            <div className="text-gray-600 font-semibold text-2xl">+</div>
            <div className="flex flex-col items-center">
              <div className="text-gray-600 font-medium text-sm">배송비</div>
              <div className="text-sm md:text-xl font-semibold text-gray-900 mt-1">
                {formatToWon(maxDeliveryPrice)}원
              </div>
            </div>
            <div className="text-gray-600 font-semibold text-2xl">=</div>
            <div className="flex flex-col items-center p-2 md:p-4 rounded-lg">
              <div className="text-gray-700 font-bold text-sm">TOTAL</div>
              <div className="text-sm md:text-2xl font-bold text-black mt-1">
                {formatToWon(totalPrice)}원
              </div>
            </div>
          </div>
          {/* Purchase 컴포넌트로 데이터 전달 */}
          <Purchase
            data={cart}
            method={paymentMethod}
            vbankHolder={vbankHolder}
            address={
              addressData.address +
                addressData.detailaddress +
                addressData.postaddress || ""
            }
            totalPrice={totalPrice}
            phone={selectedUser === "existing" ? phone : newPhone}
            phoneNumber={phoneNumber}
            disabled={isPurchaseDisabled()}
            username={selectedUser === "existing" ? username : newUsername}
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
