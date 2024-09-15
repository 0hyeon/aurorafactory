import { ActionState, FormState } from "./types";
export const TOKEN_EXPIRATION_TIME = 3 * 60 * 1000; // 3분 (밀리초)

export const initFormValue: FormState = {
  username: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  address: "",
  postaddress: "",
  detailaddress: "",
  token: "",
};

export const initialState = {
  token: false,
};
