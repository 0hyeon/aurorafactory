export type ActionState = {
  token: boolean;
  error?: {
    formErrors?: string[];
    fieldErrors?: string[];
  };
};

export interface FormState {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  address: string;
  postaddress: string;
  detailaddress: string;
  token: string;
}
export interface Istate {
  token: boolean;
  tokenSentAt?: number;
  error?: {
    fieldErrors: {
      username: string[];
      email: string[];
      phone: string[];
      password: string[];
      confirm_password: string[];
      address: string[];
      postaddress: string[];
      detailaddress: string[];
      token: string[];
    };
  };
}
