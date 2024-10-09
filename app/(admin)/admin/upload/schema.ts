import { z } from "zod";

export const productSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  category: z.string({
    required_error: "category is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }),
  discount: z.coerce.string().optional(),
  productPictureId: z.number({
    required_error: "productPictureId is required",
  }),
});

export type ProductType = z.infer<typeof productSchema>;
