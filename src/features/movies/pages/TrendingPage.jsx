import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import tmdbClient from '../../../config/tmdb';
import MovieCard from '../../../components/MovieCard';
import SkeletonCard from '../../../components/SkeletonCard';

/**
 * TrendingPage loads trending movies paginated with infinite scroll.
 */
export default function TrendingPage() {
  const loadMoreRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['trendingFeedInfinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await tmdbClient.get('/trending/movie/week', {
        params: { page: pageParam },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    const target = loadMoreRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = data?.pages?.flatMap((page) => page.results) || [];

  return (
    <div className="container mx-auto px-4 md:px-12 py-8 flex flex-col gap-6 select-none">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase border-l-4 border-red-600 pl-2">
          Trending
        </h1>
        <p className="text-sm text-zinc-400 mt-1">This week's most popular movies.</p>
      </div>

      {isLoading && items.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
          {Array.from({ length: 12 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <p className="text-red-500 font-semibold">Error retrieving trending feed. Please refresh.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
            {items.map((item) => (
              <MovieCard key={item.id} item={item} typeOverride="movie" />
            ))}
          </div>

          <div ref={loadMoreRef} className="flex justify-center items-center py-8">
            {isFetchingNextPage ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
            ) : hasNextPage ? (
              <p className="text-xs text-zinc-550 italic">Scroll for more...</p>
            ) : (
              <p className="text-xs text-zinc-600 uppercase font-black tracking-widest mt-4">End of Catalog</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
