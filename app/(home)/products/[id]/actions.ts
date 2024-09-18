"use server";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { productOption } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCachedLikeStatus } from "@/app/(admin)/actions";
import { revalidateCartCount } from "../../cart/actions";

interface IcartCreate {
  quantity: number;
  cartId: number;
  optionId: number;
}

interface CartButtonProps {
  options: { id: number; quantity: number }[];
  cartId: number;
}

export async function cartCreate({ quantity, cartId, optionId }: IcartCreate) {
  revalidateCartCount();

  const cookieStore = cookies();
  const session = await getSession(cookieStore);
  if (session.id) {
    console.log("getCachedLikeStatus : ", session.id);
    await getCachedLikeStatus(session.id);
  }

  if (!session.id) return { ok: false, message: " 로그인 후 이용해주세요" };

  const existingCartItem = await db.cart.findFirst({
    where: {
      productId: Number(cartId),
      productOptionId: Number(optionId),
      userId: session.id,
      orderstat: {
        not: "결제완료",
      },
    },
  });

  if (existingCartItem) {
    return { ok: false, message: "이미 장바구니에 담긴 상품입니다" };
  }

  const productOptionExists = await db.productOption.findUnique({
    where: { id: Number(optionId) },
  });

  if (!productOptionExists) {
    console.log("Product option not found: ", optionId);
    return {
      ok: false,
      message: "해당 옵션을 찾을 수 없습니다. 관리자에게 문의바랍니다.",
    };
  }

  const cart = await db.cart.create({
    data: {
      quantity,
      orderstat: "결제대기",
      product: {
        connect: {
          id: Number(cartId),
        },
      },
      user: {
        connect: {
          id: session.id,
        },
      },
      productOption: {
        connect: {
          id: Number(optionId),
        },
      },
    },
    select: {
      id: true,
    },
  });

  return { ok: true, message: "장바구니에 담았습니다.", cartId: cart.id };
}
