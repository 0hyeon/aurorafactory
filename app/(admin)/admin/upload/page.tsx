"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useState, useEffect } from "react";
import { ProductType, productSchema } from "./schema";
import { getCategory, uploadProduct } from "./actions";
import Select from "@/components/Selcect";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { OptionType } from "../option/[id]/schema";
import { zodResolver } from "@hookform/resolvers/zod";
export default function AddProduct() {
  const [state, dispatch] = useFormState(uploadProduct, null);
  const [categoryData, setCategoryData] = useState<
    { id: number; category: string }[]
  >([]);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategory();
        setCategoryData(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-1/3 mx-auto my-10 overflow-y-auto">
      <form action={dispatch} className="p-5 flex flex-col gap-5">
        <Input
          required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={state?.fieldErrors.title}
        />
        <Input
          type="number"
          required
          placeholder="가격"
          {...register("price")}
          errors={state?.fieldErrors.price}
        />
        <Input
          type="text"
          required
          placeholder="자세한 설명"
          {...register("description")}
          errors={state?.fieldErrors.description}
        />
        <Input
          type="text"
          required
          placeholder="카테고리"
          {...register("category")}
          errors={state?.fieldErrors.category}
        />
        <Input
          type="number"
          required
          placeholder="할인율"
          {...register("discount")}
          errors={state?.fieldErrors.discount}
        />
        <Select
          data={categoryData}
          value={getValues("productPictureId") || ""} // 빈 값은 기본값 처리
          {...register("productPictureId", {
            required: "옵션을 선택해주세요.", // 유효성 검사
          })}
          onChange={(event) => {
            const selectedId = String(event.target.value); // 선택된 id를 숫자로 변환
            setValue("productPictureId", selectedId, {
              shouldValidate: true,
              shouldDirty: true,
            });
            console.log("Selected productPictureId:", selectedId);
          }}
          errors={state?.fieldErrors?.productPictureId} // 에러 메시지 연결
        />

        <Button text="작성 완료" type="submit" />
      </form>
    </div>
  );
}
