import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Slide from "../components/slide";
import Button from "@/components/button";

async function getIsOwner(userId: number) {
  const session = await getSession();
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

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});

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
      slideimages: true,
    },
  });
  return product;
}
export async function getProducts() {
  const product = db.product.findMany({});
  return product;
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
  console.log(product);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId); //해당 태그만 새로고침
  const revalidate = async () => {
    "use server";
    revalidateTag("product-title"); //next cache의 세번째인자 tags 에 해당 문자열있으면 getCachedProductTitle 가 재할당
  };
  const onClickCart = () => {
    alert("onClickCart");
  };
  return (
    <div className="w-full max-w-[1100px] mx-auto">
      <div className="flex ">
        <div className="w-[500px]">
          <div className="relative aspect-square">
            <Slide data={product} />
          </div>
        </div>
        <div className="w-[500px]">
          <div className="p-5 ">
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <div className="font-semibold text-xl">
              category : {product.category}
            </div>
            <div className="font-semibold text-xl">
              description : {product.description}
            </div>
            <div className="font-semibold text-xl">
              price : {formatToWon(product.price)}
            </div>
            <div className="font-semibold text-xl">title : {product.title}</div>
            <button className="p-5 bg-white text-blue-400 rounded-md border-gray-400 border font-semibold text-xl">
              장바구니
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
