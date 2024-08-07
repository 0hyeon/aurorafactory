"use server";

import Best from "@/components/Best";
import BestItem from "@/components/BestItem";
import Footer from "@/components/Footer";
import Tabs from "@/components/Tab";
import HashTag from "@/components/hashtag";
import Slide from "@/components/slide";
import SlideSmall from "@/components/slideSmall";
import { slideData } from "@/static/data";
import { getCachedProducts } from "./products/[id]/page";

export default async function Home() {
  const items = await getCachedProducts();
  return (
    <>
      <main className={""}>
        <Slide />
        <div className="max-w-[1000px] mx-auto my-0">
          <SlideSmall />
          <Best data={slideData} />
          <HashTag />
          <Tabs />
          {/* <Youtube /> */}
          <Best data={slideData} />
          <BestItem data={items} />
          <SlideSmall />
        </div>
      </main>
      <div className="w-full mx-auto my-0 border-t-[1px] border-b-[1px] border-t-[#efefef] border-b-[#efefef] bg-[#f9fafb]">
        <Footer />
      </div>
    </>
  );
}
