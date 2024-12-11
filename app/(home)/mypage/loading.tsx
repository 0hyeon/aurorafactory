import React from "react";

export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Slide Skeleton */}
      <div className="relative w-full h-[360px] bg-neutral-300"></div>

      {/* Main Content Skeleton */}
      <div className="max-w-[1000px] mx-auto my-0 space-y-10">
        {/* SlideSmall Skeleton */}
        <div className="relative w-full h-[180px] bg-neutral-300"></div>

        {/* BestItem Skeleton */}
        <div className="space-y-6">
          {/* BestItem Header */}
          <div className="flex items-end justify-between">
            <div className="flex gap-3">
              <div className="h-8 w-40 bg-neutral-300 rounded-md"></div>
              <div className="h-6 w-20 bg-neutral-300 rounded-md"></div>
            </div>
            <div className="h-8 w-8 bg-neutral-300 rounded-full"></div>
          </div>

          {/* BestItem Content */}
          <div className="grid grid-cols-4 gap-5">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="space-y-3">
                <div className="relative w-[260px] h-[260px] bg-neutral-300 rounded-md"></div>
                <div className="h-5 w-3/4 bg-neutral-300 rounded-md"></div>
                <div className="flex gap-3">
                  <div className="h-4 w-1/3 bg-neutral-300 rounded-md"></div>
                  <div className="h-4 w-1/3 bg-neutral-300 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HashTag Skeleton */}
        <div className="flex gap-3 flex-wrap bg-[#eef3f8] p-5 rounded-md">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="h-8 w-24 bg-neutral-300 rounded-full"
            ></div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="flex justify-center space-x-4 border-b border-neutral-300 py-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-8 w-32 bg-neutral-300 rounded-md"></div>
          ))}
        </div>

        {/* Additional BestItem Skeleton */}
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="space-y-6">
            <div className="flex items-end justify-between">
              <div className="flex gap-3">
                <div className="h-8 w-40 bg-neutral-300 rounded-md"></div>
                <div className="h-6 w-20 bg-neutral-300 rounded-md"></div>
              </div>
              <div className="h-8 w-8 bg-neutral-300 rounded-full"></div>
            </div>
            <div className="grid grid-cols-4 gap-5">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="relative w-[260px] h-[260px] bg-neutral-300 rounded-md"></div>
                  <div className="h-5 w-3/4 bg-neutral-300 rounded-md"></div>
                  <div className="flex gap-3">
                    <div className="h-4 w-1/3 bg-neutral-300 rounded-md"></div>
                    <div className="h-4 w-1/3 bg-neutral-300 rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* YouTube Skeleton */}
        <div className="relative w-full h-[500px] bg-neutral-300 rounded-md"></div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-4 w-full h-16 bg-neutral-300"></div>
    </div>
  );
}
