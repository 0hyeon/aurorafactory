"use server";
import React from "react";
import { getCachedCart, getCachedProductSrc } from "./action";
import CartList from "./components/CartList";
import db from "@/lib/db";

export default async function CartPage() {
  const cartData = await getCachedCart();

  // Fetch product options for all cart items
  const cartItems = await Promise.all(
    cartData.map(async (el) => {
      const productOption = await db.productOption.findUnique({
        where: { id: el.productOptionId },
        include: {
          product: true,
        },
      });
      if (!productOption) return null;

      const basePrice =
        productOption.product.price *
        (1 - Number(productOption.product.discount || 0) / 100);

      let finalBasePrice = basePrice;
      if (productOption.plusdiscount && productOption.plusdiscount > 0) {
        const totalDiscountPercentage =
          Number(productOption.product.discount || 0) / 100 +
          Number(productOption.plusdiscount) / 100;

        finalBasePrice *= 1 - totalDiscountPercentage;
      }

      const totalPrice = finalBasePrice * el.quantity;
      const photo = await getCachedProductSrc(el.productId);

      return {
        ...el,
        option: {
          ...productOption,
          product: {
            ...productOption.product,
            photo: photo as string | null,
          },
        },
        basePrice: finalBasePrice,
        totalPrice,
      };
    })
  );

  const validCartItems = cartItems.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

  return <div>{validCartItems && <CartList data={validCartItems} />}</div>;
}
