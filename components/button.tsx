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
    <button
      type={type}
      disabled={pending}
      onClick={onClick}
      className="w-full primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed bg-black text-white rounded-md"
    >
      {pending ? "Loading..." : text}
    </button>
  );
}
