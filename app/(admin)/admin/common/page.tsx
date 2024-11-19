"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productSchema } from "./schema";
import {
  getUploadUrl,
  handleProductSubmit,
  uploadProduct,
  uploadUpdateProduct,
} from "./actions";
import Image from "next/image";
import { CATEGORIES } from "@/lib/constants";
import { NullableProduct } from "@/types/type";
import { useFormState } from "react-dom";

export default function AddProductCommon({ edit }: { edit?: ProductType }) {
  const [uploadUrl, setUploadUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [slideUploadUrl, setSlideUploadUrl] = useState<string[]>([]);
  const [slideFile, setSlideFile] = useState<File[]>([]);

  // useFormState를 사용하여 서버 액션과 통합
  const [state, dispatch] = useFormState(handleProductSubmit, null);

  // useForm으로 클라이언트 유효성 검사 설정
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setFile(file);

    const uploadResponse = await getUploadUrl();
    if (uploadResponse.success) {
      const { id, uploadURL } = uploadResponse.result;
      setUploadUrl(uploadURL);
    }
  };

  const onSlideImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const previewUrl = URL.createObjectURL(file);
      const uploadResponse = await getUploadUrl();
      if (uploadResponse.success) {
        const { id, uploadURL } = uploadResponse.result;
        setPhotoPreview((prev) => [...prev, previewUrl]);
        setSlideUploadUrl((prev) => [...prev, uploadURL]);
        setSlideFile((prev) => [...prev, file]);
      }
    }
  };

  const deleteHandler = (index: number) => {
    setPhotoPreview((prev) => prev.filter((_, idx) => idx !== index));
    setSlideFile((prev) => prev.filter((_, idx) => idx !== index));
    setSlideUploadUrl((prev) => prev.filter((_, idx) => idx !== index));
  };

  useEffect(() => {
    if (edit) {
      setPreview(edit.photo || "");
    }
  }, [edit]);

  return (
    <div className="w-1/3 mx-auto my-10 overflow-y-auto">
      <form
        action={(formData) => {
          formData.append("file", file as File);
          formData.append("uploadUrl", uploadUrl);
          formData.append("slideFiles", JSON.stringify(slideFile));
          formData.append("slideUrls", JSON.stringify(slideUploadUrl));
          dispatch(formData);
        }}
        onSubmit={handleSubmit((data) => {
          console.log("Client validation success:", data);
        })}
        className="p-5 flex flex-col gap-5"
      >
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {preview === "" ? <PhotoIcon className="w-20" /> : null}
        </label>

        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />

        <label className="mr-3 w-20 h-20 cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
          <svg
            className="h-12 w-12"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            onChange={onSlideImageChange}
            type="file"
            id="photos"
            name="photos"
            accept="image/*"
            className="hidden"
            multiple
          />
        </label>

        {photoPreview && (
          <div className="flex flex-wrap">
            {photoPreview.map((src: string, idx: number) => (
              <span className="mr-3 relative w-1/6" key={idx}>
                <span
                  className="cursor-pointer absolute z-10 right-[-5px] top-[-10px] bg-black text-white rounded-full w-5 h-5 flex justify-center items-center text-sm"
                  onClick={() => deleteHandler(idx)}
                >
                  X
                </span>
                <Image
                  src={src}
                  className="text-gray-600 h-auto rounded-md bg-slate-300 object-cover"
                  width={800}
                  height={800}
                  alt="Preview"
                />
              </span>
            ))}
          </div>
        )}

        <Input
          {...register("category")}
          placeholder="카테고리명"
          errors={[errors.category?.message ?? ""]}
        />

        <Button text={edit ? "수정 완료" : "작성 완료"} type="submit" />
      </form>
    </div>
  );
}
