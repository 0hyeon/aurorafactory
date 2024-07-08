import { z } from "zod";

export const OptionSchema = z.object({
  color: z.string().nonempty("Color is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  plusdiscount: z.number().min(0, "Discount must be at least 0"),
  connectProductId: z
    .number()
    .int()
    .positive("Product ID must be a positive integer"),
});
