export interface IslideData {
  id: number;
  src: string;
  text: string;
  price: number;
  sale: number;
  reviews: number;
  category: string;
}
export type TabValue = "드시모네" | "또박케어LAB";

export type PhotoPreviewType = string[];

interface FileDetails {
  id: string;
  uploadURL: string;
}

export type SlideFileType = FileDetails[];
