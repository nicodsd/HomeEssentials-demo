import React from 'react';

/**
 * Skeleton placeholder matching the Home product card layout while waiting for server data.
 */
const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-between w-full bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
      <div className="relative aspect-square w-full skeleton-shimmer">
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="h-5 w-16 rounded-full bg-gray-300/70" />
          <div className="h-7 w-7 rounded-full bg-gray-300/70" />
        </div>
      </div>

      <div className="p-2 flex flex-col flex-grow justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 skeleton-shimmer rounded w-4/5" />
          <div className="h-2.5 skeleton-shimmer rounded w-full mt-1" />
          <div className="h-2.5 skeleton-shimmer rounded w-2/3" />
        </div>

        <div className="flex items-end justify-between mt-3">
          <div className="h-5 w-14 skeleton-shimmer rounded" />
          <div className="w-8 h-8 rounded-full skeleton-shimmer shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
