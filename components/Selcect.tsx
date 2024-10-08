// Select Component
import React from "react";

interface SelectProps {
  data: string[];
  name: string;
  register: any; // The type can be more specific if desired
  errors: any;
  defaultValue?: string; // 기본값을 위한 defaultValue 추가
}

function Select({ data, name, register, errors, defaultValue }: SelectProps) {
  return (
    <div>
      <select
        className="w-full border border-[#ddd] py-2 px-1 rounded"
        {...register(name)}
        defaultValue={defaultValue || ""} // 기본 선택값 설정
      >
        {/* 기본 선택값이 없을 경우를 대비한 빈 옵션 */}
        <option value="" disabled={!defaultValue}>
          {defaultValue ? defaultValue : "Select an option"}
        </option>
        {data.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name]?.message && (
        <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}

export default Select;
