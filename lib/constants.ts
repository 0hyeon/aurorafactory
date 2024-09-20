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
  NAME_SHORT = "최소 두글자 이상 입력해주세요.",
  NAME_LONG = "너무길어요 (최대12자)",
}

export const CONTENT_PER_PAGE = 1;
export const MB = 1048576;
export const PLZ_ADD_PHOTO = "사진을 추가해주세요.";

export const CATEGORIES = [
  "발포지",
  "에어캡봉투",
  "은박봉투",
  "과일박스",
  "에어셀.공기주입",
  "과일비닐봉투",
  "일반봉투",
  "야채비닐봉투",
  "발포시트지",
  "라미시트지",
  "아이스팩",
];
export const ALIGO_SEND_API = "https://kakaoapi.aligo.in/akv10/alimtalk/send/";
export const COMPANY = "오로라팩(주)";
export const SIGN_UP_TEMPLATES = "TM_2223";
