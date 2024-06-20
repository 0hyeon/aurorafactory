"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";

interface IcartCreate {
  quantity: number;
  cartId: number;
  optionId: number;
}

export async function cartCreate({ quantity, cartId, optionId }: IcartCreate) {
  console.log("cart action data: ", { quantity, cartId, optionId });
  const session = await getSession();
  console.log("session: ", session);
  if (!session.id) return { message: "로그인 후 이용해주세요" };

  const existingCartItem = await db.cart.findFirst({
    where: {
      productId: Number(cartId),
      productOptionId: Number(optionId),
      userId: session.id,
    },
  });

  if (existingCartItem) {
    return { message: "이미 장바구니에 담긴 상품입니다" };
  }

  const productOptionExists = await db.productOption.findUnique({
    where: { id: Number(optionId) },
  });

  if (!productOptionExists) {
    console.log("Product option not found: ", optionId);
    return {
      message: "해당 옵션을 찾을 수 없습니다. 관리자에게 문의바랍니다.",
    };
  }

  const cart = await db.cart.create({
    data: {
      quantity,
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
  console.log("cart: ", cart);

  return { message: "장바구니에 담았습니다.", cartId: cart.id };
}
