"use client";
export default function CartButton() {
  const onClickCart = () => {
    alert("onClickCart");
  };

  return (
    <button
      onClick={onClickCart}
      className="w-1/2 p-3 bg-white hover:bg-blue-400 hover:text-white text-blue-400 rounded-md border-gray-400 border font-semibold text-base hover:border-blue-400 duration-300"
    >
      장바구니담기
    </button>
  );
}
