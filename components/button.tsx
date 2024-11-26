"use client";
import { MouseEventHandler } from "react";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  type?: "button" | "reset" | "submit";
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
export default function Button({
  type = "button",
  text,
  onClick,
}: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-5 text-center shadow-lg">
            <div className="loader mb-4"></div>
            <p className="text-gray-700">진행 중입니다...</p>
          </div>
        </div>
      ) : (
        ""
      )}
      <button
        type={type}
        disabled={pending}
        onClick={onClick}
        className="hover:bg-gray-500 transition w-full primary-btn h-12 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed bg-black text-white rounded-md"
      >
        {pending ? "Loading..." : text}
      </button>
    </>
  );
}
