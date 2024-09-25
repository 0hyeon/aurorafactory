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
import Youtube from "@/components/Youtube";

export default async function Home() {
  const items = await getCachedProducts();
  return (
    <>
      <main>
        <Slide />
        <div className="max-w-[1000px] mx-auto my-0">
          <SlideSmall />
          {/* <Best data={slideData} /> */}
          <BestItem data={items} subtitle="all" title="전체상품" />
          <HashTag />
          <Tabs />

          {/* <Best data={slideData} /> */}

          <BestItem
            data={items.filter((el) => el.category === "에어캡봉투")}
            subtitle="완충효과 100%"
            title="에어캡봉투"
          />
          <BestItem
            data={items.filter((el) => el.category === "은박봉투")}
            subtitle="온도유지"
            title="은박봉투"
          />
          <BestItem
            data={items.filter((el) => el.category === "발포지")}
            subtitle="가성비ㆍ탁월한"
            title="발포봉투"
          />
          <Youtube url="https://youtu.be/EwqRj6SHNxg?si=Ixqv5SGzytn63ByB" />
          {/* <SlideSmall /> */}
        </div>
      </main>
      <div className="mt-4 w-full mx-auto my-0 border-t-[1px] border-b-[1px] border-t-[#efefef] border-b-[#efefef] bg-[#f9fafb]">
        <Footer />
      </div>
    </>
  );
}
