"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OptionType, OptionSchema } from "../schema";
import { uploadProductOption } from "../actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Cart, Product, User, productOption } from "@prisma/client";
import { NullableProduct } from "@/types/type";

export default function AddOptionDetailpage({
  product,
  params,
}: {
  product: NullableProduct; // product 타입을 명확히 지정
  params: { id: string };
}) {
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
  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("quantity", data.quantity + "");
    formData.append("color", data.color);
    formData.append("plusdiscount", data.plusdiscount + "");
    formData.append("connectProductId", data.connectProductId + "");

    const errors = await uploadProductOption(formData);
    if (errors) {
      console.log("errors : ", errors);
    } else {
      window.location.reload();
    }
  });
  const router = useRouter();

  const toModifyBtn = (n: number | undefined) => {
    if (n !== undefined) {
      router.push(`/admin/edit/${n}`);
    } else {
      alert("수정할수없는 상품입니다.");
    }
  };
  const onValid = async (e: any) => {
    e.preventDefault();
    await onSubmit();
  };
  return (
    <div className="w-2/3 mx-auto my-10 p-8 bg-gray-50 shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">상품 옵션 관리</h1>
      <div className="flex flex-row items-start justify-between gap-10">
        {/* 상품 옵션 리스트 */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            옵션 리스트
          </h2>
          <div className="space-y-4">
            {product?.productoption &&
              product.productoption.map((el: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-6 p-4 bg-white shadow-sm rounded-lg border border-gray-200"
                >
                  <span className="text-gray-600">수량: {el.quantity}</span>
                  <span className="text-gray-600">색상: {el.color}</span>
                  <span className="text-gray-600">
                    추가 할인율: {el.plusdiscount}%
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* 상품 정보와 옵션 추가 */}
        <div className="flex-1">
          <div className="relative block w-96 h-96 mb-6">
            {product?.productPicture?.photo ? (
              <Image
                src={`${product.productPicture.photo}/public`}
                alt={product.productPicture.photo || ""}
                fill
                className="rounded-md"
                style={{ objectFit: "contain" }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-md">
                <span className="text-gray-500">이미지 없음</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mb-6">
            <Button onClick={() => toModifyBtn(product?.id)} text="상품 수정" />
          </div>
          <form
            onSubmit={onValid}
            className="p-6 bg-white rounded-lg shadow-md space-y-4"
          >
            <Input
              required
              placeholder="수량"
              type="number"
              {...register("quantity")}
              name="quantity"
              errors={[errors.quantity?.message ?? ""]}
              className="border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
            <Input
              type="text"
              required
              placeholder="색상"
              {...register("color")}
              name="color"
              errors={[errors.color?.message ?? ""]}
              className="border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
            <Input
              type="number"
              required
              placeholder="추가할인율"
              {...register("plusdiscount")}
              name="plusdiscount"
              errors={[errors.plusdiscount?.message ?? ""]}
              className="border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
            <Button text="작성 완료" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
