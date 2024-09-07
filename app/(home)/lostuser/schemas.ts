import { z } from "zod";
import {
  INVALID,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { getUserWithEmail } from "./repositories";
import validator from "validator";
export const userFormSchema = z.object({
  username: z
    .string({
      invalid_type_error: `이름은 ${INVALID.STRING}`,
      required_error: `이름을 ${INVALID.INPUT}`,
    })
    .min(2, `이름을 ${INVALID.NAME_SHORT}`)
    .max(12, `이름이 ${INVALID.NAME_LONG}`),
  phone: z
    .string()
    .trim()
    .refine(
      (phone) => validator.isMobilePhone(phone, "ko-KR"),
      "올바른 핸드폰 번호 타입이 아닙니다."
    ),
});

export type userFindType = z.infer<typeof userFormSchema>;

const checkEmailExists = async (email: string) => {
  const user = await getUserWithEmail(email);
  return Boolean(user);
};
export const productSchema = z.object({
  id: z.coerce.number().optional(),
  photo: z.string({
    required_error: "사진은 필수입니다.",
  }),
  title: z
    .string({
      required_error: "제목을 입력해 주세요.",
      invalid_type_error: "제목을 문자 형태 입력해 주세요.",
    })
    .min(3, "제목을 최소 3자 이상 입력해 주세요."),
  description: z
    .string({
      required_error: "설명을 입력해 주세요.",
      invalid_type_error: "설명을 문자 형태로 입력해 주세요.",
    })
    .min(3, "설명을 최소 3자 이상 입력해 주세요."),
  price: z.coerce
    .number({
      required_error: "가격을 입력해 주세요.",
      invalid_type_error: "가격을 숫자 형태로  입력해 주세요.",
    })
    .min(1, "가격을 1원 이상 입력해 주세요."),
});

export type ProductType = z.infer<typeof productSchema>;
