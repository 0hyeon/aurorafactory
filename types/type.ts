import {
  Cart,
  Product,
  User,
  productOption,
  productPicture,
  slideImage,
} from "@prisma/client";

export interface IslideData {
  id: number;
  src: string;
  text: string;
  price: number;
  sale: number;
  reviews: number;
  category: string;
}
export type TabValue =
  | "드시모네"
  | "또박케어LAB"
  | "라미봉투"
  | "보냉봉투"
  | "에어캡봉투";

export type PhotoPreviewType = string[];

interface FileDetails {
  id: string;
  uploadURL: string;
}

export type SlideFileType = FileDetails[];

export interface IProduct extends Product {
  productoption?: productOption[];
  productPicture?: {
    id: number;
    photo: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    slideimages: slideImage[];
  } | null;
  cart?: Cart[];
  user?: User;
}

export type NullableProduct = IProduct | null;
