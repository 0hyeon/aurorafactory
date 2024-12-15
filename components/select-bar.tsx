"use client";
import React, { useCallback } from "react";
import { formatToWon } from "@/lib/utils";
import { productOption } from "@prisma/client";

interface SelectComponentProps {
  options: productOption[];
  price: number;
  discount: number;
  quantity: number;
  onSelect: (
    optionDetails: string,
    price: string,
    plusPrice: number,
    pdOptionId: number,
    dummycount: number
  ) => void;
  selectedOptions: { id: number }[]; // 추가: 선택된 옵션의 id를 관리
}

const SelectComponent = ({
  options,
  price,
  discount,
  quantity,
  onSelect,
  selectedOptions, // 추가
}: SelectComponentProps) => {
  const calculatePrice = useCallback(
    (selectedOption: any) => {
      const resultDiscount =
        Number(selectedOption.plusdiscount || 0) + discount;
      const basePriceWithPlusPrice = price + (selectedOption.plusPrice || 0); // plusPrice를 basePrice에 추가
      return formatToWon(
        basePriceWithPlusPrice * (1 - Number(resultDiscount) / 100) * quantity
      );
    },
    [discount, price, quantity]
  );

  const handleSelect = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      if (selectedValue === "") {
        onSelect("", "", NaN, NaN, NaN); // 선택되지 않은 상태 처리
        return;
      }

      const selected = options.find(
        (option: any) => option.id === Number(selectedValue)
      );

      const isOptionAlreadySelected = selectedOptions.some(
        (option) => option.id === selected?.id
      );

      if (isOptionAlreadySelected) {
        alert("이미 선택된 옵션입니다.");
        event.target.value = ""; // 선택 초기화
        return;
      }

      if (selected) {
        const calculatedPrice = calculatePrice(selected);
        const optionDetails = `${selected.quantity}장 ${selected.color} ${
          selected.plusdiscount && selected.plusdiscount > 0
            ? `( 추가할인율 ${selected.plusdiscount}% ) * `
            : " * "
        } 장당 ${calculatedPrice}원
        = ${formatToWon(
          selected.quantity * Number(calculatedPrice.replace(/,/g, ""))
        )}원
        `;

        onSelect(
          optionDetails,
          calculatedPrice,
          selected.plusPrice || 0, // plusPrice 추가
          selected.id,
          selected.quantity // dummycount로 전달
        );
      }
    },
    [options, calculatePrice, onSelect, selectedOptions]
  );

  return (
    <div className="mt-4">
      <label
        htmlFor="product-options"
        className="block text-sm font-medium text-gray-700"
      >
        옵션 선택
      </label>
      <select
        id="product-options"
        name="product-options"
        className="mt-1 block w-full p-4 md:py-2 md:px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onChange={handleSelect}
        value="" // 기본값으로 선택되지 않음을 명시
      >
        <option value="" disabled>
          --옵션을 선택해주세요--
        </option>
        {options.map((option: productOption) => (
          <option key={option.id} value={option.id}>
            {`${option.quantity}장 ${option.color} ${
              option.plusdiscount && option.plusdiscount > 0
                ? `( 추가할인율 ${option.plusdiscount}% )`
                : ""
            } ${
              option.plusPrice > 0
                ? `(+ 추가 가격 ${formatToWon(option.plusPrice)}원)`
                : ""
            }`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
