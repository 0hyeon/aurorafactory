// import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Loading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      <div className="flex gap-[50px] max-w-[1100px] mx-auto border-b border-[#999] pb-14">
        {/* Left Section Skeleton */}
        <div className="w-[500px]">
          <div className="relative aspect-square bg-neutral-300 rounded-md" />
        </div>

        {/* Right Section Skeleton */}
        <div className="w-[550px] flex flex-col gap-5">
          {/* Title Skeleton */}
          <div className="h-8 w-3/4 bg-neutral-300 rounded-md" />

          {/* Price and Discount Skeleton */}
          <div className="space-y-3">
            <div className="h-5 w-1/2 bg-neutral-300 rounded-md" />
            <div className="h-6 w-1/4 bg-neutral-300 rounded-md" />
            <div className="h-7 w-2/3 bg-neutral-300 rounded-md" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-full bg-neutral-300 rounded-md" />
            <div className="h-5 w-3/4 bg-neutral-300 rounded-md" />
            <div className="h-5 w-2/4 bg-neutral-300 rounded-md" />
          </div>

          {/* Options Skeleton */}
          <div className="h-10 w-full bg-neutral-300 rounded-md" />

          {/* Selected Options Skeleton */}
          <div className="space-y-3">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="h-5 w-1/3 bg-neutral-300 rounded-md" />
                <div className="h-5 w-1/5 bg-neutral-300 rounded-md" />
              </div>
            ))}
          </div>

          {/* Buttons Skeleton */}
          <div className="flex gap-2">
            <div className="h-10 w-36 bg-neutral-300 rounded-md" />
            <div className="h-10 w-36 bg-neutral-300 rounded-md" />
          </div>
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="relative block w-[40%] mx-auto aspect-[1/10] bg-neutral-300 rounded-md" />
    </div>
  );
}
