"use client";
import { getSession, logout } from "@/lib/session";
import { cookies } from "next/headers";

const LogoutButton = () => {
  return <button onClick={logout}>로그아웃</button>;
};

export default LogoutButton;
