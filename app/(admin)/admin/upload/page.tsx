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
  const [uploadUrl, setUploadUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [slideUploadUrl, setSlideUploadUrl] = useState<string[]>([]);
  const [slideFile, setSlideFile] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const previewurl = URL.createObjectURL(file);
    setPreview(previewurl);
    setFile(file);

    const uploadResponse = await getUploadUrl();
    if (uploadResponse.success) {
      const { id, uploadURL } = uploadResponse.result;
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/z_5GPN_XNUgqhNAyIaOv1A/${id}`
      );
    }
    console.log(file)
  };

  const onSlideImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const dummyid = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const previewUrl = URL.createObjectURL(file);
      const uploadResponse = await getUploadUrl();
      if (uploadResponse.success) {
        const { id, uploadURL } = uploadResponse.result;
        dummyid.push(`https://imagedelivery.net/z_5GPN_XNUgqhNAyIaOv1A/${id}`);

        setPhotoPreview((prev) => [...prev, previewUrl]);
        setSlideUploadUrl((prev) => [...prev, uploadURL]);
        setSlideFile((prev) => [...prev, file]);
      }
    }
    setValue("photos", dummyid.join(','));

  };
  console.log(slideFile)

  const onSubmit = handleSubmit(async (data) => {
    
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      if (response.status !== 200) {
      }
    }
    console.log("file : ",file)
    console.log("slideFile : ",slideFile)
    if(slideFile.length > 0){
      for (let index = 0; index < slideFile.length; index++) {
        const slideFormData = new FormData();
        slideFormData.append("file", slideFile[index]);
        const slideResponse = await fetch(slideUploadUrl[index], {
          method: "POST",
          body: slideFormData,
        });
        if (slideResponse.status !== 200) {
          console.error(`Failed to upload slide image ${index}`);
          continue
        }
      }

    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);
    formData.append("photo", data.photo);
    formData.append("photos", data.photos);
    console.log("data.photo  : ",data.photo)//https://imagedelivery.net/aSbksvJjax-AUC7qVnaC4A/201ed09f-9386-4ff1-9321-bb505acdd100
    // formData.append("photos[]", data.photos);

    // if (data.photos && data.photos.length) {
    //   data.photos.forEach(photoUrl => {
    //     formData.append("photos[]", photoUrl);
    //   });
    // }

   
    // data.photos.forEach((photoUrl) => {
    //   formData.append("photos[]", photoUrl);
    // });
  
    console.log("formData : ",formData)

    const errors = await uploadProduct(formData);
    if (errors) {
      // setError("")
      console.log("errors : ",errors)
    }else {
      // If all async operations complete successfully, refresh the page
      window.location.reload();
    }

  });

  const deleteHandler = (index: number) => {
    setPhotoPreview((prev) => prev.filter((_, idx) => idx !== index));
    setSlideFile((prev) => prev.filter((_, idx) => idx !== index));
    setSlideUploadUrl((prev) => prev.filter((_, idx) => idx !== index));
  };
  const onValid = async (e:any) => {
    e.preventDefault();  
    await onSubmit();
  };
  return (
    <div className="w-1/4 mx-auto my-10">
      <form onSubmit={onValid} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})`, backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat' }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
            </>
          ) : null}
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
        {photoPreview ? (
          <div className="flex w-30">
            {photoPreview.map((src: any, idx: any) => (
              <span className="mr-3 relative" key={idx}>
                <span
                  className="cursor-pointer absolute z-10 right-[-5px] top-[-10px] bg-black text-white rounded-full w-5 h-5 flex justify-center items-center text-sm"
                  onClick={() => deleteHandler(idx)}
                  key={idx}
                >
                  X
                </span>
                <Image
                  src={src}
                  className=" text-gray-600 h-46 rounded-md bg-slate-300 object-cover"
                  width={80}
                  height={80}
                  alt={src}
                />
              </span>
            ))}
          </div>
        ) : null}

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