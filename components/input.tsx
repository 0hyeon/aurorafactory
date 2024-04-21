import React, { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

interface InputProps {
  name: string;
  errors?: string[];
}
const _Input = ({
  name,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>,ref:ForwardedRef<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        {...rest}
      />
      {errors.map((error, idx) => (
        <span key={idx} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
};
export default forwardRef(_Input);
