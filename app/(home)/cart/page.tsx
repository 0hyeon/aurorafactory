"use server";
import React, { useCallback, useEffect, useState } from "react";
import { getCart } from "./action";
import CartList from "./components/CartList";

export default async function CartPage() {
  const cartData = await getCart();
  return <div>{cartData && <CartList data={cartData} />}</div>;
}
