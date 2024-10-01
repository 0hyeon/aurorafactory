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
    <div className="w-1/2 mx-auto my-10">
      <div className="flex flex-row items-center justify-between gap-5">
        {/* 상품옵션리스트 */}
        <div>
          {product?.productoption &&
            product.productoption.map((el: any, index: number) => (
              <div key={index} className="flex gap-10">
                <span>수량 : {el.quantity}</span>
                <span>색상 : {el.color}</span>
                <span>추가할인율 : {el.plusdiscount}%</span>
              </div>
            ))}
        </div>

        <div>
          <Button onClick={() => toModifyBtn(product?.id)} text="상품수정" />
          <div className="relative block w-28 h-28">
            {product?.productoption && (
              <Image
                src={`${product.photo}/public`}
                alt={product.photo}
                fill
                style={{ objectFit: "contain" }}
              />
            )}
          </div>
          <form onSubmit={onValid} className="p-5 flex flex-col gap-5">
            <Input
              required
              placeholder="수량"
              type="number"
              {...register("quantity")}
              name="quantity"
              errors={[errors.quantity?.message ?? ""]}
            />
            <Input
              type="text"
              required
              placeholder="색상"
              {...register("color")}
              name="color"
              errors={[errors.color?.message ?? ""]}
            />
            <Input
              type="number"
              required
              placeholder="추가할인율"
              {...register("plusdiscount")}
              name="plusdiscount"
              errors={[errors.plusdiscount?.message ?? ""]}
            />
            <Button text="작성 완료" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
