"use server";
import bcrypt from "bcrypt";

import { loginFormSchema } from "./schema";
import { signIn } from "./services";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export const createAccount = async (formData: FormData) => {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    address: formData.get('address'),
    postaddress: formData.get('postaddress'),
    detailaddress: formData.get('detailaddress'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),

  };

  const result = await loginFormSchema.spa(data); // spa Alias of safeParseAsync

  if (!result.success) return result.error.flatten();
  else await signIn(result.data);
};