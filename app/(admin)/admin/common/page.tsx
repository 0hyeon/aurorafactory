"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Image from "next/image";
import { NullableProduct } from "@/types/type";
import { uploadProduct, uploadUpdateProduct } from "./actions";
import { useFormStatus } from "react-dom";
export default function AddProductCommon() {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [slideFile, setSlideFile] = useState<File[]>([]);
  const { pending } = useFormStatus();

  const prepareFormData = async () => {
    const formData = new FormData();

    // 메인 이미지 파일 추가
    if (file) {
      formData.append("photo", file);
    }

    // 슬라이드 이미지 파일 추가
    if (slideFile.length > 0) {
      for (const slide of slideFile) {
        formData.append("photos", slide);
      }
    }

    // 카테고리 필드 추가
    const categoryInput = document.querySelector<HTMLInputElement>(
      "input[name='category']"
    );
    if (categoryInput) {
      formData.append("category", categoryInput.value);
    }

    // `edit` 객체가 있다면 ID 추가
    // if (edit) {
    //   formData.append("id", String(edit.id));
    // }

    return formData;
  };

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setFile(file);
  };

  const onSlideImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setSlideFile((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPhotoPreview((prev) => [...prev, ...newPreviews]);
  };

  const deleteHandler = (index: number) => {
    setPhotoPreview((prev) => prev.filter((_, idx) => idx !== index));
    setSlideFile((prev) => prev.filter((_, idx) => idx !== index));
  };
  return (
    <div className="w-1/3 mx-auto my-10 overflow-y-auto relative">
      {pending && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-5 text-center shadow-lg">
            <div className="loader mb-4"></div>
            <p className="text-gray-700">진행 중입니다...</p>
          </div>
        </div>
      )}
      <form
        action={async () => {
          const formData = await prepareFormData();
          // if (edit) {
          //   await uploadUpdateProduct(formData); // 서버 액션 호출
          // }
          // else {
          await uploadProduct(formData); // 서버 액션 호출
          // }
        }}
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

        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-2 cursor-pointer">
          <span>슬라이드 이미지 추가</span>
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
            {photoPreview.map((src, idx) => (
              <span className="mr-3 relative w-1/6" key={idx}>
                <button
                  type="button"
                  onClick={() => deleteHandler(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  &times;
                </button>
                <Image
                  src={`${src}`}
                  className="text-gray-600 h-auto rounded-md bg-slate-300 object-cover"
                  width={800}
                  height={800}
                  alt={`${src}`}
                />
              </span>
            ))}
          </div>
        )}

        <Input
          type="text"
          required
          placeholder="카테고리명"
          // defaultValue={edit?.category || ""}
          defaultValue={""}
          name="category"
        />

        {/* <Button text={edit ? "수정 완료" : "작성 완료"} type="submit" /> */}
        <Button text={"수정 완료"} type="submit" />
      </form>
    </div>
  );
}
