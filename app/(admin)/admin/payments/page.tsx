// page.tsx
"use server";

import { revalidateTag } from "next/cache";
import { fetchOrderedData } from "./actions"; // 서버 액션 임포트
import OrderedComp from "./components/page";

export default async function AddOptionList() {
  // 초기 주문 데이터를 가져옵니다.
  const initialOrdered = await fetchOrderedData();

  // "cart" 캐시 태그를 재검증하여 데이터를 최신화합니다.
  revalidateTag("cart");

  return (
    <div className="flex w-11/12 flex-wrap gap-8 mx-auto p-10 bg-gray-50 rounded-lg shadow-lg">
      <OrderedComp
        initialOrdered={initialOrdered} // 초기 데이터 전달
      />
    </div>
  );
}
