export type ActionState = {
  token: boolean;
  error?: {
    formErrors: string[];
    fieldErrors: any;
  };
};
// types.ts
export interface FormState {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  address: string;
  postaddress: string;
  detailaddress: string;
  token?: string;
}
