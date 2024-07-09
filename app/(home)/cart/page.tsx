"use server";
import React from "react";
import { getCachedCart, getCachedProductSrc } from "./action";
import CartList from "./components/CartList";
import db from "@/lib/db";
import { Cart, Product, productOption } from "@prisma/client";
interface ProductOptionWithProduct extends productOption {
  product: Product & { photo: string | null };
}
export default async function CartPage() {
  const cartData = await getCachedCart();

  // Fetch product options for all cart items
  const cartItems = await Promise.all(
    //TODO: Promise.all await 되는동안 loading스켈레톤 만들기
    cartData.map(async (el: Cart) => {
      const productOption = await db.productOption.findUnique({
        where: { id: el.productOptionId },
        include: {
          product: true,
        },
      });
      if (!productOption) return null;

      let basePrice = productOption.product.price;

      const finalBasePrice = (
        price: number,
        discount: string | null,
        plusdiscount: string | null | number
      ) => {
        // 기본 가격을 설정합니다.
        let basePrice = price;

        // `discount`를 숫자로 변환하고, 값이 없다면 0으로 설정합니다.
        const discountValue = discount ? Number(discount) : 0;

        // `plusdiscount`를 숫자로 변환하고, 값이 없다면 0으로 설정합니다.
        const plusDiscountValue = plusdiscount ? Number(plusdiscount) : 0;

        // 총 할인율을 계산합니다.
        const totalDiscount = (discountValue + plusDiscountValue) / 100;

        // 총 할인율이 0보다 큰 경우 할인율을 적용하여 최종 기본 가격을 계산합니다.
        if (totalDiscount > 0) {
          return basePrice * (1 - totalDiscount);
        } else {
          // 할인율이 없는 경우 기본 가격을 반환합니다.
          return basePrice;
        }
      };

      const totalPrice =
        finalBasePrice(
          basePrice,
          productOption.product.discount,
          productOption.plusdiscount
        ) * el.quantity;
      const photo = await getCachedProductSrc(el.productId);
      console.log(el.id, basePrice, finalBasePrice, totalPrice);
      return {
        ...el,
        option: {
          ...productOption,
          product: {
            ...productOption.product,
            photo: photo as string | null,
          },
        },
        basePrice,
        totalPrice,
      };
    })
  );

  const validCartItems = cartItems.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

  return <div>{validCartItems && <CartList data={validCartItems} />}</div>;
}
