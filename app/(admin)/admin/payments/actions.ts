"use server";

import db from "@/lib/db";
import { Cart } from "@prisma/client";

// 주문 데이터를 가져오는 서버 액션
export async function fetchOrderedData(date?: Date): Promise<Cart[]> {
  const filter = date
    ? {
        createdAt: {
          gte: new Date(date.setHours(0, 0, 0, 0)), // 날짜의 시작 시간
          lte: new Date(date.setHours(23, 59, 59, 999)), // 날짜의 끝 시간
        },
      }
    : {};

  return await db.cart.findMany({
    where: {
      orderstat: "결제완료",
      ...filter,
    },
    take: 25,
  });
}