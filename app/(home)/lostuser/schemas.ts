import { z } from "zod";
import {
  INVALID,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { getUserWithEmail } from "./repositories";
import validator from "validator";
import { getUserIdWithEmail, getUserIdWithPhone } from "../signup/repositories";
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

export const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "올바른 핸드폰 번호 타입이 아닙니다."
  )
  .superRefine(async (data, ctx) => await isExistUser(data, ctx, "phone"));

const isExistUser = async (
  data: any,
  ctx: z.RefinementCtx,
  flag: "email" | "phone"
) => {
  const user =
    flag === "email"
      ? await getUserIdWithEmail(data.email)
      : await getUserIdWithPhone(data);
  if (user == null) {
    ctx.addIssue({
      code: "custom",
      message:
        flag === "email"
          ? "해당 이메일로 가입된 회원이 이미 존재합니다."
          : "해당 번호로 가입된 회원이 없습니다.",
      path: [flag === "email" ? "email" : "phone"],
      fatal: true, // 이슈 발생 시 다음 유효성 검사 실행 안 함
    });
  }
};
