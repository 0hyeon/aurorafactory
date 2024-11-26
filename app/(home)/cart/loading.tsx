export default function Loading() {
  return (
    <div className="flex flex-col gap-8 max-w-[1100px] mx-auto animate-pulse">
      {/* Cart Items Section */}
      {[...Array(2)].map((_, index) => (
        <div key={index} className="flex">
          <div className="relative block w-56 h-56 bg-neutral-300 rounded-md flex-grow-0 mr-6"></div>
          <div className="border-b border-gray-500 flex-grow pl-3">
            <div className="flex items-center justify-between pr-[5%]">
              <div className="space-y-3">
                <div className="h-6 w-3/4 bg-neutral-300 rounded-md"></div>
                <div className="h-5 w-1/2 bg-neutral-300 rounded-md"></div>
                <div className="h-5 w-1/3 bg-neutral-300 rounded-md"></div>
                <div className="h-5 w-2/3 bg-neutral-300 rounded-md"></div>
                <div className="h-5 w-1/3 bg-neutral-300 rounded-md"></div>
                <div className="h-6 w-1/2 bg-neutral-300 rounded-md"></div>
              </div>
              <div className="h-8 w-8 bg-neutral-300 rounded-md"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Payment Method Section */}
      <div className="flex gap-10">
        <div className="my-4 w-1/2">
          <div className="space-y-4">
            <div className="h-6 w-2/3 bg-neutral-300 rounded-md"></div>
            <div className="h-10 w-full bg-neutral-300 rounded-md"></div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-6 w-1/3 bg-neutral-300 rounded-md"></div>
            <div className="h-10 w-full bg-neutral-300 rounded-md"></div>
            <div className="h-6 w-1/3 bg-neutral-300 rounded-md"></div>
            <div className="h-10 w-full bg-neutral-300 rounded-md"></div>
          </div>
        </div>

        {/* Address Section */}
        <div className="my-4 w-1/2 space-y-4">
          <div className="h-6 w-2/3 bg-neutral-300 rounded-md"></div>
          <div className="flex gap-4">
            <div className="h-6 w-1/3 bg-neutral-300 rounded-md"></div>
            <div className="h-6 w-1/3 bg-neutral-300 rounded-md"></div>
          </div>
          <div className="h-10 w-full bg-neutral-300 rounded-md"></div>
        </div>

        {/* Recipient Section */}
        <div className="mt-4 w-1/2 space-y-4">
          <div className="h-6 w-2/3 bg-neutral-300 rounded-md"></div>
          <div className="flex gap-4">
            <div className="h-6 w-1/3 bg-neutral-300 rounded-md"></div>
            <div className="h-6 w-1/3 bg-neutral-300 rounded-md"></div>
          </div>
          <div className="h-10 w-full bg-neutral-300 rounded-md"></div>
          <div className="h-10 w-full bg-neutral-300 rounded-md"></div>
        </div>
      </div>

      {/* Total Price Section */}
      <div className="my-10 flex justify-around items-center gap-4 bg-neutral-100 p-6 rounded-lg shadow-lg border border-gray-200">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className="h-4 w-20 bg-neutral-300 rounded-md"></div>
            <div className="h-6 w-24 bg-neutral-300 rounded-md"></div>
          </div>
        ))}
        <div className="h-6 w-6 bg-neutral-300 rounded-md"></div>
      </div>

      {/* Purchase Button Section */}
      <div className="flex items-center justify-center">
        <div className="h-12 w-1/3 bg-neutral-300 rounded-md"></div>
      </div>
    </div>
  );
}
