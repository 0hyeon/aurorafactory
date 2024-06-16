import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Slide from "../components/slide";
import CartButton from "./components/cart";
import SelectComponent from "@/components/select-bar";
import { Product } from "@prisma/client";

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
      slideimages: true,
      productoption: true,
    },
  });
  console.log("product : ", product);
  return product;
}
export async function getProducts() {
  const product = db.product.findMany({});
  return product;
}

export const discountedPrice = (product: Product) => {
  return formatToWon(product.price * (1 - Number(product.discount) / 100));
};

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
  console.log("product : ", product);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId); //해당 태그만 새로고침
  const revalidate = async () => {
    "use server";
    revalidateTag("product-title"); //next cache의 세번째인자 tags 에 해당 문자열있으면 getCachedProductTitle 가 재할당
  };
  return (
    <div className="w-full max-w-[1100px] mx-auto">
      <div className="flex gap-[50px] pt-[60px]">
        <div className="w-[500px]">
          <div className="relative aspect-square">
            <Slide data={product} />
          </div>
        </div>
        <div className="w-[550px]">
          <div className="p-5 ">
            <div className="pb-[18px] px-[5px] border-b border-[#d5dbdc]">
              <h1 className="text-3xl font-medium tracking-[-.06em]">
                {product.title}
              </h1>
            </div>
            <div className="font-semibold text-xl">
              category : {product.category}
            </div>
            <div className="font-semibold text-xl">
              description : {product.description}
            </div>
            <div className="font-semibold text-xl">
              price : {formatToWon(product.price)}원
            </div>
            <div className="font-semibold text-xl">
              discount : {`${product.discount}%`}
            </div>
            <div className="font-semibold text-xl">
              판매가 : {discountedPrice(product)}원
            </div>

            <div className="pb-[18px] px-[5px] border-b border-[#d5dbdc]">
              <div>제품선택</div>
              <SelectComponent
                options={product?.productoption}
                price={product?.price}
                discount={product.discount}
              />
            </div>
            <div className="font-semibold text-xl">title : {product.title}</div>
            <CartButton />
          </div>
        </div>
      </div>
    </div>
  );
}
