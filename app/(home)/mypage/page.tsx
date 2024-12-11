import React from "react";
import { getSessionAurora } from "../cart/actions";
import { Cart } from "@prisma/client";
import { getCachedOrdered } from "./action";
import OrderedComponent, { ExtendedCart } from "./components/OrderedComponent";

const Mypage = async () => {
  const session = await getSessionAurora();
  const orderedData: Cart[] = session.id
    ? await getCachedOrdered(String(session.id))
    : [];
  console.log("orderedData : ", orderedData);
  return (
    <div className="flex flex-col gap-10 py-8 px-6 max-w-[600px] mx-auto border-[1px] border-black rounded-md mt-5 md:mt-0">
      <OrderedComponent data={orderedData as ExtendedCart[]} />
    </div>
  );
};

export default Mypage;
