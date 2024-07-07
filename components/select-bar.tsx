"use client";
import React, { useCallback, useEffect, useState } from "react";
import { formatToWon } from "@/lib/utils";
import { productOption } from "@prisma/client";

interface SelectComponentProps {
  options: any;
  price: number;
  discount: number;
  quantity: number;
  onSelect: (
    optionDetails: string,
    price: string,
    pdOptionId: number,
    dummycount: number
  ) => void;
  selectedOptions: any[]; // 추가
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
      return formatToWon(price * (1 - Number(resultDiscount) / 100) * quantity);
    },
    [discount, price, quantity]
  );

  const handleSelect = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      if (selectedValue === "") {
        onSelect("", "", NaN, NaN);
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
        return;
      }

      if (selected) {
        const calculatedPrice = calculatePrice(selected);
        const optionDetails = `${selected.quantity}장 ${selected.color} ${
          selected.plusdiscount && selected.plusdiscount > 0
            ? `( 추가할인율 ${selected.plusdiscount}% ) * `
            : " * "
        } 장당 ${calculatedPrice}원
        = ${formatToWon(selected.quantity * Number(calculatedPrice))}원
        `;

        onSelect(
          optionDetails,
          calculatedPrice,
          selected.id,
          selected.quantity
        );
      }
    },
    [options, calculatePrice, onSelect, selectedOptions]
  );

  // 선택된 옵션의 정보를 state로 관리
  const [selectedOptionText, setSelectedOptionText] =
    useState<string>("--선택--");

  // selectedOptions이 변경될 때마다 선택된 옵션의 텍스트 업데이트
  useEffect(() => {
    if (selectedOptions.length > 0) {
      const lastSelectedOption = selectedOptions[selectedOptions.length - 1];
      const optionText = `${lastSelectedOption.quantity}장 ${
        lastSelectedOption.color
      } ${
        lastSelectedOption.plusdiscount && lastSelectedOption.plusdiscount > 0
          ? `( 추가할인율 ${lastSelectedOption.plusdiscount}% )`
          : ""
      }`;
      setSelectedOptionText(optionText);
    } else {
      setSelectedOptionText("--선택--");
    }
  }, [selectedOptions]);

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
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onChange={handleSelect}
        value="" // 선택된 값은 state로 관리
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
            }`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
