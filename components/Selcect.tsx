import React, { ForwardedRef, forwardRef } from "react";

type SelectProps = {
  data: { id: number; category: string }[]; // 옵션 데이터 (id와 category 포함)
  value: string | number; // 선택된 값 (string | number 허용)
  errors?: string | string[] | undefined; // 에러 메시지 (string | string[] | undefined)
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void; // onChange 핸들러
};

const _Select = (
  { data, value, errors, onChange, ...rest }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>
) => {
  return (
    <div className="flex flex-col gap-2">
      <select
        ref={ref}
        value={value || ""} // 기본값을 빈 문자열로 처리
        onChange={onChange} // onChange 핸들러 연결
        className={`bg-transparent rounded-md w-full h-10 outline-none ring-1 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed pl-3 ${
          errors ? "ring-red-500 focus:ring-red-500" : ""
        }`}
        {...rest}
      >
        {/* 기본값 옵션 */}
        <option value="" disabled>
          -- 옵션을 선택해주세요 --
        </option>
        {/* 실제 데이터 옵션 */}
        {data.map((option) => (
          <option key={option.id} value={option.id}>
            {option.category}
          </option>
        ))}
      </select>
      {/* 에러 메시지 출력 */}
      {Array.isArray(errors) ? (
        errors.map((err, idx) => (
          <span key={idx} className="text-red-500 font-medium">
            {err}
          </span>
        ))
      ) : errors ? (
        <span className="text-red-500 font-medium">{errors}</span>
      ) : null}
    </div>
  );
};

export default forwardRef(_Select);
