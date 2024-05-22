'use server';

import { loginFormSchema } from "./schema";
import { signIn } from "./services";

export const createAccount = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
    address: formData.get('address'),
    postaddress: formData.get('postaddress'),
    detailaddress: formData.get('detailaddress'),
  };

  const result = await loginFormSchema.spa(data); // spa Alias of safeParseAsync

  if (!result.success) return result.error.flatten();
  else await signIn(result.data);
};