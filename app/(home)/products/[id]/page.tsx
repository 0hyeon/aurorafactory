"use server";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { Product } from "@prisma/client";
import ProductDetailClient from "./components/ProductDetailClient";
import { getSession } from "@/lib/session";
import { cookies } from "next/headers";

async function getIsOwner(userId: number) {
  const cookieStore = cookies();
  const session = await getSession(cookieStore);

  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});
export const getCachedProducts = nextCache(getProducts, ["products"], {
  tags: ["products"],
});
const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export async function getProductTitle(id: number) {
  const product = db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

export async function getProduct(id: number) {
  const product = db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
      productPicture: {
        include: {
          slideimages: true,
        },
      },
      productoption: true,
    },
  });
  return product;
}

export async function getProducts() {
  const product = await db.product.findMany({
    include: {
      productPicture: {
        include: {
          slideimages: true,
        },
      },
    },
  });
  return product;
}

export async function generateStaticParams() {
  const products = await getProducts(); // 모든 제품을 가져옴
  return products.map((product) => ({ id: String(product.id) })); // 각 제품의 ID로 페이지 생성
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const revalidate = async () => {
    "use server";
    revalidateTag("product-title");
  };
  revalidateTag("products");
  return <ProductDetailClient product={product} params={id} />;
}
