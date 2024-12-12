"use client";

import { Cart, Product, productOption, productPicture } from "@prisma/client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface ExtendedCart extends Cart {
  product:
    | (Product & {
        productPicture: Pick<productPicture, "photo"> | null; // productPicture의 photo만 포함
        productoption: productOption[]; // productoption 배열 전체 포함
      })
    | null; // product 자체가 null일 수 있음
}

const OrderedComponent = ({ data }: { data: ExtendedCart[] }) => {
  
  // TODO:리뷰링크와 리뷰관련 스키마,ACTION 구현하기
  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-center text-xl font-bold mb-5">결제 완료된 내역</h2>
      {data.length === 0 ? (
        <p className="text-center text-gray-500">
          결제 완료된 내역이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {data.map((order) => (
            <Link key={order.id} href={`products/${order.productId}`}>
              <div className="border rounded-lg p-4 shadow-md flex flex-wrap md:flex-nowrap gap-4 items-center">
                {/* 상품 이미지 */}
                <Image
                  alt={order.product?.productPicture?.photo || "Product Image"}
                  src={
                    `${order.product?.productPicture?.photo}/public` ||
                    "/default.jpg"
                  }
                  width={120}
                  height={120}
                  className="rounded-md object-contain w-full md:w-32 h-32"
                />
                {/* 주문 상세 정보 */}
                <div className="flex-1 text-sm">
                  <p>
                    <span className="font-semibold">상품 이름:</span>
                    {order.product?.title}
                  </p>
                  <p>
                    <span className="font-semibold">카테 고리:</span>
                    {order.product?.category}
                  </p>
                  <p>
                    <span className="font-semibold">가격:</span>
                    {order.product?.price}
                  </p>
                  <p>
                    <span className="font-semibold">업데이트 날짜:</span>
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderedComponent;
