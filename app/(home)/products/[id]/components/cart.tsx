"use client";
export default function CartButton() {
  const onClickCart = () => {
    alert("onClickCart");
  };

  return (
    <button
      onClick={onClickCart}
      className="p-3 bg-white text-blue-400 rounded-md border-gray-400 border font-semibold text-base"
    >
      Add to Cart
    </button>
  );
}
