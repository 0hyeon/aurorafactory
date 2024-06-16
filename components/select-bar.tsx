import { formatToWon } from "@/lib/utils";
import { productOption } from "@prisma/client";
import React from "react";

function SelectComponent({
  options,
  price,
  discount,
}: {
  options: productOption[];
  price: number;
  discount: any;
}) {
  const plusDiscount = (plusdiscount: number) => {
    const resultDiscount = Number(plusdiscount) + Number(discount);
    console.log("resultDiscount : ", resultDiscount);
    return formatToWon(price * (1 - Number(resultDiscount) / 100));
  };
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
      >
        {options &&
          options.map((option: productOption, index: any) => (
            <option key={index} value={option.id}>
              {`${option.quantity}장 ${option.color} 
                ${
                  option.plusdiscount && option.plusdiscount > 0
                    ? `추가할인율 ${option.plusdiscount}%`
                    : ""
                }
                ${option.plusdiscount && plusDiscount(option?.plusdiscount)}원`}
            </option>
          ))}
      </select>
    </div>
  );
}

export default SelectComponent;
