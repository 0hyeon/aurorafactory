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
export type LameBagValue = "0.5T" | "1T" | "2T";
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

export interface IKakaoUser {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
      is_default_nickname: boolean;
    };
    name_needs_agreement: boolean;
    name?: string; // optional if not always present
    has_phone_number: boolean;
    phone_number_needs_agreement: boolean;
    phone_number?: string; // optional if not always present
  };
}
export interface SendMessageParams {
  receiver: string;
  msg: string;
  msg_type?: string;
  title?: string;
  testmode_yn?: string;
}
// 예시 Order 타입 정의
export interface Order {
  id: number;
  userId: number;
  productId: number;
  productOptionId: number;
  quantity: number;
  orderstat: string | null;
  orderId: string | null;
  name: string | null;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  product: Product;
  productOption: productOption;
}
