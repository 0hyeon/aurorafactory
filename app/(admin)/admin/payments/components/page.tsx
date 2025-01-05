"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { fetchOrderedData } from "../actions";
import { Order } from "@/types/type";

// OrderedCompProps는 타입으로만 내보내기

function OrderedComp({ initialOrdered }: any) {
  const CustomInput = ({ value, onClick }: any) => (
    <button onClick={onClick}>
      {value}
      <CalendarIcon className="w-5 h-5 ml-2 text-gray-500" />
    </button>
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrdered);

  const getFilteredOrdered = async (date: Date) => {
    const filteredData = await fetchOrderedData(date);
    setFilteredOrders(filteredData);
  };

  useEffect(() => {
    if (selectedDate !== null) {
      getFilteredOrdered(selectedDate);
    } else {
      setFilteredOrders(initialOrdered);
    }
  }, [selectedDate, initialOrdered]);

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex flex-col w-full">
      <div className="mb-6">
        <label htmlFor="dateFilter" className="mr-2 text-lg">
          날짜 선택:
        </label>
        <DatePicker
          id="dateFilter"
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)}
          dateFormat="yyyy/MM/dd"
          isClearable
          customInput={<CustomInput />}
        />
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 p-3">주문 ID</th>
            <th className="border border-gray-400 p-3">제품</th>
            <th className="border border-gray-400 p-3">상태</th>
            <th className="border border-gray-400 p-3">이름</th>
            <th className="border border-gray-400 p-3">번호</th>
            <th className="border border-gray-400 p-3">주소</th>
            <th className="border border-gray-400 p-3">주문일</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((el) => (
            <tr key={el.id} className="hover:bg-gray-50 text-sm">
              <td className="border border-gray-300 p-3">
                {el.orderId || "정보 없음"}
              </td>
              <td className="border border-gray-300 p-3">
                {(`[${el.product?.category}] ` || "") +
                  (el.product?.title || "") +
                  " " +
                  el.quantity * el.productOption?.quantity}
                장
              </td>
              <td className="border border-gray-300 p-3">
                {el.orderstat || "상태 없음"}
              </td>
              <td className="border border-gray-300 p-3">
                {el.user?.username || "정보 없음"}
              </td>
              <td className="border border-gray-300 p-3">
                {el.user?.phone || "정보 없음"}
              </td>
              <td className="border border-gray-300 p-3">
                {(el.user?.address || "") + (el.user?.detailaddress || "") ||
                  "정보 없음"}
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

export default OrderedComp;
