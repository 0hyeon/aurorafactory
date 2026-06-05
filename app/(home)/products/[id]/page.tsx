"use server";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import ProductDetailClient from "./components/ProductDetailClient";

export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});
export const getCachedProducts = nextCache(getProducts, ["products"], {
  tags: ["products"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return {};

  const product = await getCachedProduct(id);
  if (!product) return {};

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aurorafac.co.kr';
  const imageUrl = product.productPicture?.photo
    ? `${product.productPicture.photo}/public`
    : `${BASE_URL}/images/aurora_logo.jpg`;
  const description = product.description.replace(/\s+/g, ' ').trim().slice(0, 120);

  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      url: `${BASE_URL}/products/${product.id}`,
      type: 'website',
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.title }],
    },
  };
}


export async function getProduct(id: number) {
  const product = db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
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
      _count: {
        select: {
          productoption: true,
          cart: true,
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
  // await new Promise((resolve) => setTimeout(resolve, 3600000));
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  revalidateTag("products");

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aurorafac.co.kr';
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.productPicture?.photo ? `${product.productPicture.photo}/public` : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'KRW',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/products/${product.id}`,
      seller: { '@type': 'Organization', name: '주식회사 오로라팩' },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, '\\u003c') }}
      />
      <ProductDetailClient product={product} params={id} />
    </>
  );
}
