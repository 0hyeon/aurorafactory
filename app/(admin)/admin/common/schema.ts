import { z } from "zod";

export const productSchema = z.object({
  photos: z.string().min(1, "At least one photo is required"),
  photo: z.string({
    required_error: "photo is required",
  }),
  category: z.string({
    required_error: "category is required",
  }),
});

export type ProductType = z.infer<typeof productSchema>;
