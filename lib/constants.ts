export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
  "비밀번호는 대﹒소문자, 하나 이상의 숫자, 특수문자를 포함해야 합니다.";

export enum INVALID {
    TOO_SHORT = "너무 짧습니다.",
    TOO_LONG = "너무 깁니다.",
    EMAIL = "잘못된 이메일 형식입니다.",
    STRING = "문자여야 합니다.",
  INPUT = "입력해주세요.",
}

export const CONTENT_PER_PAGE = 1;
export const MB = 1048576;
export const PLZ_ADD_PHOTO = "사진을 추가해주세요.";

export const CATEGORIES = ['발포지','에어캡봉투','뽁뽁이']