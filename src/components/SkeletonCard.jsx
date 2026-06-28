import React from 'react';

/**
 * SkeletonCard renders a loading state card mimicking MovieCard layout.
 */
export default function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2 shrink-0 w-36 sm:w-44 md:w-52 select-none">
      {/* Poster placeholder */}
      <div className="relative aspect-[2/3] w-full rounded-lg bg-zinc-800 animate-pulse" />
      
      {/* Text placeholder lines */}
      <div className="h-4 bg-zinc-800 rounded-md w-11/12 animate-pulse mt-1" />
      <div className="h-3 bg-zinc-800 rounded-md w-3/5 animate-pulse" />
    </div>
  );
}
