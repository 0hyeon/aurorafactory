"use server";
import bcrypt from "bcrypt";

import { loginFormSchema } from "./schema";
import { signIn } from "./services";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export const createAccount = async (formData: FormData) => {
  console.log("createAccount: ",formData);
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    address: formData.get('address'),
    postaddress: formData.get('postaddress'),
    detailaddress: formData.get('detailaddress'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
    
  };
  
  const result = await loginFormSchema.spa(data);
  // console.log(result);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    signIn(result.data);
  }
}
