import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { OptionType, OptionSchema } from "./schema";
import { uploadOption } from "./action";
import { getCachedProduct } from "@/app/(home)/products/[id]/page";

export default async function AddOptionDetailpage({ id }: { id: number }) {
  const product = await getCachedProduct(id);
  console.log("product : ", product);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<OptionType>({
    resolver: zodResolver(OptionSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    const errors = await uploadProduct(formData);
    if (errors) {
      // setError("")
      console.log("errors : ", errors);
    } else {
      // If all async operations complete successfully, refresh the page
      window.location.reload();
    }
  });

  const onValid = async (e: any) => {
    e.preventDefault();
    await onSubmit();
  };
  console.log(errors);
  return (
    <div className="w-1/4 mx-auto my-10">
      <form onSubmit={onValid} className="p-5 flex flex-col gap-5">
        <Input
          required
          placeholder="수량"
          type="number"
          {...register("quantity")}
          errors={[errors.quantity?.message ?? ""]}
        />
        <Input
          type="text"
          required
          placeholder="색상"
          {...register("color")}
          errors={[errors.color?.message ?? ""]}
        />
        <Input
          type="number"
          required
          placeholder="추가할인율"
          {...register("plusdiscount")}
          errors={[errors.discount?.message ?? ""]}
        />
        <Button text="작성 완료" type="submit" />
      </form>
    </div>
  );
}
