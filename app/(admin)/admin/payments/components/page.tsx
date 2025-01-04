// components/OrderedComp.tsx
"use client";

import { useState, useEffect, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { fetchOrderedData } from "../actions";

interface Order {
  id: number;
  userId: number;
  productId: number;
  productOptionId: number;
  quantity: number;
  orderstat: string | null;
  orderId: string | null;
  name: string | null;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderedCompProps {
  initialOrdered: Order[]; // 초기 주문 데이터
}

const CustomInput = forwardRef<HTMLButtonElement, any>(
  ({ value, onClick }, ref) => (
    <button onClick={onClick} ref={ref}>
      {value}
      <CalendarIcon className="w-5 h-5 ml-2 text-gray-500" />
    </button>
  )
);

export default function OrderedComp({ initialOrdered }: OrderedCompProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 선택된 날짜 상태
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrdered); // 필터링된 주문 데이터

  // 서버 액션을 클라이언트에서 호출하는 함수
  const getFilteredOrdered = async (date: Date) => {
    const filteredData = await fetchOrderedData(date); // 날짜에 맞는 데이터를 서버에서 가져옵니다.
    setFilteredOrders(filteredData); // 필터링된 데이터 상태 업데이트
  };

  useEffect(() => {
    if (selectedDate !== null) {
      getFilteredOrdered(selectedDate); // 날짜가 선택되면 필터링된 데이터 가져오기
    } else {
      setFilteredOrders(initialOrdered); // 날짜가 없으면 초기 데이터 사용
    }
  }, [selectedDate, initialOrdered]);

  // 최신일자 순으로 정렬 (내림차순)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex flex-col w-full ">
      <div className="mb-6">
        <label htmlFor="dateFilter" className="mr-2 text-lg">
          날짜 선택:
        </label>
        <DatePicker
          id="dateFilter"
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)} // 날짜 선택 시 상태 업데이트
          dateFormat="yyyy/MM/dd"
          isClearable
          customInput={<CustomInput />} // 커스텀 날짜 입력 버튼 사용
        />
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 p-3">주문 ID</th>
            <th className="border border-gray-400 p-3">제품 ID</th>
            <th className="border border-gray-400 p-3">옵션 ID</th>
            <th className="border border-gray-400 p-3">수량</th>
            <th className="border border-gray-400 p-3">상태</th>
            <th className="border border-gray-400 p-3">이름</th>
            <th className="border border-gray-400 p-3">주소</th>
            <th className="border border-gray-400 p-3">주문일</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((el) => (
            <tr key={el.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-3">
                {el.orderId || "정보 없음"}
              </td>
              <td className="border border-gray-300 p-3">{el.productId}</td>
              <td className="border border-gray-300 p-3">
                {el.productOptionId}
              </td>
              <td className="border border-gray-300 p-3">{el.quantity}</td>
              <td className="border border-gray-300 p-3">
                {el.orderstat || "상태 없음"}
              </td>
              <td className="border border-gray-300 p-3">
                {el.name || "정보 없음"}
              </td>
              <td className="border border-gray-300 p-3">
                {el.address || "정보 없음"}
              </td>
              <td className="border border-gray-300 p-3">
                {new Date(el.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
