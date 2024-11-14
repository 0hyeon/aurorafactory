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

export const OptionSchemaAddress = z.object({
  address: z.string().min(1, "도로명주소를 입력하세요."),
  postaddress: z.string().min(1, "우편번호를 입력하세요."),
  detailaddress: z.string().min(1, "상세주소를 입력하세요."),
  newAddress: z.string().min(1, "새로운 배송 주소를 입력하세요."), // 새로운 주소 입력에 대한 필드 추가
});

export const OptionSchemaUser = z.object({
  username: z
    .string()
    .min(1, { message: "사용자명을 입력하세요." })
    .max(50, { message: "사용자명은 50자를 초과할 수 없습니다." }),
  phone: z
    .string()
    .regex(/^010\d{8}$/, { message: "유효한 핸드폰 번호를 입력하세요." })
    .optional(), // 기존 phone을 선택할 때도 사용 가능하도록 optional로 설정
});
