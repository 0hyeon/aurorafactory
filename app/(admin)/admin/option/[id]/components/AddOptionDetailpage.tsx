"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OptionType, OptionSchema } from "../schema";
import {
  uploadProductOption,
  delProductOption,
  getCachedProduct,
} from "../actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Cart, Product, User, productOption } from "@prisma/client";
import { NullableProduct } from "@/types/type";
import { getProduct } from "@/app/(home)/products/[id]/page";
import ProductBox from "./ProductBox";
import { useFormState } from "react-dom";

export default function AddOptionDetailpage({
  product,
  params,
}: {
  product: NullableProduct; // product 타입을 명확히 지정
  params: { id: string };
}) {
  console.log("product : ", product);
  console.log("params : ", params.id);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<OptionType>({
    resolver: zodResolver(OptionSchema),
    defaultValues: {
      connectProductId: params.id, // 기본 값으로 설정
    },
  });
  const [state, dispatch] = useFormState(uploadProductOption, null);

  // const onSubmit = handleSubmit(async (data) => {
  //   const formData = new FormData();
  //   formData.append("quantity", data.quantity + "");
  //   formData.append("color", data.color);
  //   formData.append("plusdiscount", data.plusdiscount + "");
  //   formData.append("connectProductId", data.connectProductId + "");
  //   formData.append("deliver_price", data.deliver_price + "");

  //   const errors = await uploadProductOption(formData);
  //   if (errors) {
  //     console.log("errors : ", errors);
  //   } else {
  //     window.location.reload();
  //   }
  // });
  const router = useRouter();

  const toModifyBtn = (n: number | undefined) => {
    if (n !== undefined) {
      router.push(`/admin/edit/${n}`);
    } else {
      alert("수정할수없는 상품입니다.");
    }
  };
  // const onValid = async (e: any) => {
  //   e.preventDefault();
  //   await onSubmit();
  // };
  const delEvent = async ({
    id,
    redirectId,
  }: {
    id: number;
    redirectId: number;
  }) => {
    await delProductOption({ id, redirectId });
    return alert("삭제완료");
  };
  return (
    <div className="w-full lg:w-2/3 mx-auto my-10 p-8 bg-gray-50 shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">상품 옵션 관리</h1>
      <div className="flex flex-col lg:flex-row gap-10">
        {/* 왼쪽: 상품 옵션 리스트 */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            옵션 리스트
          </h2>
          <div className="space-y-4">
            {product?.productoption &&
              product.productoption.map((el: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-6 p-4 bg-white shadow-sm rounded-lg border border-gray-200 items-center"
                >
                  <span className="text-gray-600">수량: {el.quantity}</span>
                  <span className="text-gray-600">색상: {el.color}</span>
                  <span className="text-gray-600">
                    추가 할인율: {el.plusdiscount}%
                  </span>
                  <span className="text-gray-600">
                    배송비: {el.deliver_price}
                  </span>
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() =>
                      delEvent({ id: el.id, redirectId: product.id })
                    }
                    className="ml-auto px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none"
                  >
                    삭제
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* 오른쪽: 상품 정보 및 옵션 추가 */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* 왼쪽: ProductBox */}
          <div className="flex-1">
            {/* <ProductBox el={product} /> */}
            <ProductBox el={product} onModifyClick={(id) => toModifyBtn(id)} />
            {/* 상품 수정 버튼 */}
          </div>

          {/* 오른쪽: 폼 영역 */}
          <div className="flex-1">
            {/* 폼 */}
            <form
              action={dispatch}
              className="p-6 bg-white rounded-lg shadow-md space-y-4"
            >
              <Input
                type="hidden"
                {...register("connectProductId")}
                value={params.id}
              />
              <Input
                required
                placeholder="수량"
                type="number"
                {...register("quantity")}
                className="border-gray-300 focus:ring-2 focus:ring-indigo-500 w-full"
                errors={state?.fieldErrors.quantity}
              />
              <Input
                required
                placeholder="색상"
                {...register("color")}
                className="border-gray-300 focus:ring-2 focus:ring-indigo-500 w-full"
                errors={state?.fieldErrors.color}
              />
              <Input
                required
                placeholder="추가할인율"
                type="number"
                {...register("plusdiscount")}
                className="border-gray-300 focus:ring-2 focus:ring-indigo-500 w-full"
                errors={state?.fieldErrors.plusdiscount}
              />
              <Input
                required
                placeholder="배송비"
                type="number"
                {...register("deliver_price")}
                className="border-gray-300 focus:ring-2 focus:ring-indigo-500 w-full"
                errors={state?.fieldErrors.deliver_price}
              />
              <Button text="작성 완료" type="submit" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
