import { z } from "zod";

export const OptionSchema = z.object({
  quantity: z.string({
    required_error: "quantity is required",
  }),
  color: z.string({
    required_error: "color is required",
  }),
  plusdiscount: z.string({
    required_error: "plusdiscount is required",
  }),
  connectProductId: z.string({
    required_error: "connectProductId is required",
  }),
  deliver_price: z.string({
    required_error: "deliver_price is required",
  }),
});

export type OptionType = z.infer<typeof OptionSchema>;
