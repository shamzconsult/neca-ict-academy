import React from "react";

export const ChartSkeleton = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
      <div className='w-full h-[300px] bg-gray-100 rounded-lg animate-pulse' />
      <div className='flex gap-2'>
        <div className='w-20 h-4 bg-gray-100 rounded animate-pulse' />
        <div className='w-20 h-4 bg-gray-100 rounded animate-pulse' />
      </div>
    </div>
  );
};
