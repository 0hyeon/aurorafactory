import { z } from 'zod';

import { INVALID, PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants';
import { hasSlang, isValidPw } from './utils';
import { isExistUser } from './services';
import db from '@/lib/db';

export const loginFormSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: `이름은 ${INVALID.STRING}`,
        required_error: `이름을 ${INVALID.INPUT}`,
      })
      .trim(),
      // .min(3, INVALID.TOO_SHORT)
      // .max(10, INVALID.TOO_LONG)
      // .toLowerCase()
      // // 그 외 유효성 검사 규칙과 메시지 추가 - refine, regex
      // .regex(hasSlang, '비속어는 허용되지 않습니다.')
      // .transform((username) => username.replaceAll('-', '')),
    email: z.string().email(INVALID.EMAIL).trim().toLowerCase(),
    address:z.string().min(1,"주소를 입력해주세요"),
    postaddress:z.string().min(1,"주소를 입력해주세요"),
    detailaddress:z.string().min(1,"상세주소를 입력해주세요"),
    password: z
      .string()
      .trim()
      .min(PASSWORD_MIN_LENGTH, INVALID.TOO_SHORT)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH, INVALID.TOO_SHORT).trim(),
  })
  // .superRefine(async ({ username }, ctx) => {
  //   const user = await db.user.findUnique({
  //     where: {
  //       username,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });
  //   if (user) {
  //     ctx.addIssue({
  //       code: "custom",
  //       message: "This username is alreday taken ",
  //       path: ["username"],
  //       fatal: true,
  //     });
  //     return z.NEVER;
  //   }
  // })
  // .refine(({ password, confirm_password }) => isValidPw({ password, confirm_password }), {
  //   message: '입력된 비밀번호가 서로 다릅니다.',
  //   path: ['confirm_password'],
  // });

  export type SignUpType = z.infer<typeof loginFormSchema>;