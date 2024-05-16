"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productSchema } from "./shema";
import { getUploadUrl, uploadProduct } from "./action";
import Image from "next/image";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadUrls, setUploadUrls] = useState<string>("");

  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [slideUploadUrls, setSlideUploadUrls] = useState<string[]>([]);
  const [slideFiles, setSlideFiles] = useState<File[]>([]);

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
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);

    const uploadResponse = await getUploadUrl();
    if (uploadResponse.success) {
      const { id, uploadURL } = uploadResponse.result;
      setUploadUrls(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/aSbksvJjax-AUC7qVnaC4A/${id}`
      );
    }
  };

  const onSlideImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const urls = files.map((file) => URL.createObjectURL(file));
    setPhotoPreview(urls);
    setSlideFiles(files);

    for (const file of files) {
      const uploadResponse = await getUploadUrl();
      if (uploadResponse.success) {
        const { id, uploadURL } = uploadResponse.result;
        setSlideUploadUrls((prev) => [...prev, uploadURL]);
      }
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log("onSubmit");
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price.toString());
    formData.append("description", data.description);

    if (file) {
      const response = await fetch(uploadUrls, {
        method: "POST",
        body: file,
      });
      if (response.ok) {
        formData.append("photo", data.photo);
      }
    }

    for (let i = 0; i < slideFiles.length; i++) {
      const response = await fetch(slideUploadUrls[i], {
        method: "POST",
        body: slideFiles[i],
      });
      if (response.ok) {
        formData.append("slidePhotos", slideFiles[i].name); // Modify this based on how you want to handle multiple image uploads on the server
      }
    }

    const errors = await uploadProduct(formData);
    if (errors) {
      // setError logic here
      console.log(errors);x
    }
  });

  const deleteHandler = (index: number) => {
    setPhotoPreview((prev) => prev.filter((_, idx) => idx !== index));
    setSlideFiles((prev) => prev.filter((_, idx) => idx !== index));
    setSlideUploadUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="w-1/4 mx-auto my-10">
      <form onSubmit={onSubmit} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
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
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172 a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            onChange={onSlideImageChange}
            type="file"
            id="slidePhoto"
            name="slidePhoto"
            accept="image/*"
            className="hidden"
            multiple
          />
        </label>
        {photoPreview.length > 0 && (
          <div className="flex w-full overflow-x-scroll">
            {photoPreview.map((src, idx) => (
              <span className="mr-3 relative" key={idx}>
                <span
                  className="cursor-pointer absolute z-10 right-[-5px] top-[-10px] bg-black text-white rounded-full w-5 h-5 flex justify-center items-center text-sm"
                  onClick={() => deleteHandler(idx)}
                >
                  X
                </span>
                <Image
                  src={src}
                  className="rounded-md bg-slate-300 object-cover"
                  width={80}
                  height={80}
                  alt="Slide Image"
                />
              </span>
            ))}
          </div>
        )}

        <Input
          required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          type="number"
          required
          placeholder="가격"
          {...register("price")}
          errors={[errors.price?.message ?? ""]}
        />
        <Input
          type="text"
          required
          placeholder="자세한 설명"
          {...register("description")}
          errors={[errors.description?.message ?? ""]}
        />
        <Button text="작성 완료" type="submit" />
      </form>
    </div>
  );
}
