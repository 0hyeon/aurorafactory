"use client";
import { Username } from "@/app/(home)/components/username";
import { Suspense } from "react";
import { Loading } from "./components";

export default function Profile({ user }: any) {
  return (
    <div className="flex gap-5 items-center justify-center">
      <Suspense fallback={<Loading />}>
        <Username user={user} />
      </Suspense>
    </div>
  );
}
