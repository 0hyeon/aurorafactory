"use client";
import React, { useCallback, useEffect, useState } from "react";
import { formatToWon } from "@/lib/utils";
import { productOption } from "@prisma/client";

interface SelectComponentProps {
  options: {
    id: number;
    productId: number;
    quantity: number | null;
    color: string | null;
    plusdiscount: number | null;
    created_at: Date;
    updated_at: Date;
  }[];
  price: number;
  discount: number;
  quantity: number;
  onSelect: (optionDetails: string, price: string, pdOptionId: number) => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  options,
  price,
  discount,
  quantity,
  onSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState<any>(null);

  const calculatePrice = useCallback(
    (selectedOption: any | null) => {
      if (selectedOption) {
        const resultDiscount =
          Number(selectedOption.plusdiscount || 0) + discount;
        return formatToWon(
          price * (1 - Number(resultDiscount) / 100) * quantity
        );
      }
      return "";
    },
    [discount, price, quantity]
  );

  const handleSelect = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      if (selectedValue === "") {
        setSelectedOption(null);
        onSelect("", "", NaN);
        return;
      }

      const selected = options.find(
        (option) => option.id === Number(selectedValue)
      );

      if (selected) {
        const calculatedPrice = calculatePrice(selected);
        const optionDetails = `${selected.quantity}장 ${selected.color} ${
          selected.plusdiscount && selected.plusdiscount > 0
            ? `( 추가할인율 ${selected.plusdiscount}% )`
            : ""
        } ${calculatedPrice}원`;

        setSelectedOption(selected);
        onSelect(optionDetails, calculatedPrice, selected.id);
      }
    },
    [options, calculatePrice, onSelect]
  );

  useEffect(() => {
    if (selectedOption) {
      const calculatedPrice = calculatePrice(selectedOption);
      const optionDetails = `${selectedOption.quantity}장 ${
        selectedOption.color
      } ${
        selectedOption.plusdiscount && selectedOption.plusdiscount > 0
          ? `( 추가할인율 ${selectedOption.plusdiscount}% )`
          : ""
      } ${calculatedPrice}원`;

      onSelect(optionDetails, calculatedPrice, selectedOption.id);
    }
  }, [selectedOption, calculatePrice, onSelect, quantity]);

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
      >
        <option value="">--선택--</option>
        {options.map((option) => (
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
