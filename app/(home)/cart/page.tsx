"use server";
import React from "react";
import { getCachedCart, getCachedProductSrc } from "./action";
import CartList from "./components/CartList";
import db from "@/lib/db";
import { Cart, Product, productOption } from "@prisma/client";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

interface ProductOptionWithProduct extends productOption {
  product: Product & { photo: string | null };
}
interface CartWithProductOption {
  id: number;
  productId: number;
  productOptionId: number;
  quantity: number;
  option: ProductOptionWithProduct;
  basePrice: number;
  totalPrice: number;
}

export default async function CartPage() {
  const session = await getSession();
  const cartData: Cart[] = await getCachedCart(session);
  console.log("cartData : ", cartData);

  // 모든 장바구니 항목에 대한 제품 옵션을 가져옵니다.
  const cartItems = await Promise.all(
    cartData.map(async (el: Cart): Promise<CartWithProductOption | null> => {
      const productOption = await db.productOption.findUnique({
        where: { id: el.productOptionId },
        include: { product: true },
      });

      if (!productOption) return null;

      const basePrice = productOption.product.price;
      const finalBasePrice = (
        price: number,
        discount: string | null,
        plusdiscount: string | number | null
      ): number => {
        const discountValue = discount ? Number(discount) : 0;
        const plusDiscountValue = plusdiscount ? Number(plusdiscount) : 0;
        const totalDiscount = (discountValue + plusDiscountValue) / 100;
        return totalDiscount > 0 ? price * (1 - totalDiscount) : price;
      };

      const totalPrice =
        finalBasePrice(
          basePrice,
          productOption.product.discount,
          productOption.plusdiscount
        ) * el.quantity;

      const photo = await getCachedProductSrc(el.productId);

      return {
        ...el,
        option: {
          ...productOption,
          product: {
            ...productOption.product,
            photo: photo as string,
          },
        },
        basePrice,
        totalPrice,
      };
    })
  );

  const validCartItems = cartItems.filter(
    (item): item is CartWithProductOption => item !== null
  );

  return <CartList data={validCartItems} />;
}
