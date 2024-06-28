"use server";
import React, { useCallback, useEffect, useState } from "react";
import { getCartCount } from "../components/action";
import { getCart } from "./action";

export default async function CartPage() {
  const cartData = await getCart();
  console.log("cartData : ", cartData);
  return <div>CartPage</div>;
}
