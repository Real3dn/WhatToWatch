import React, { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

/**
 * SectionCarousel is a horizontally scrollable list of movies/shows
 * complete with Netflix-style hover arrows for easy navigation.
 * @param {string} title - Section header title
 * @param {array} items - Content array to render
 * @param {boolean} isLoading - Loading indicator to show Skeletons
 * @param {string} typeOverride - Force media type detection overrides
 */
export default function SectionCarousel({ title, items, isLoading, typeOverride }) {
  const containerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollPosition = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollPosition, { passive: true });
      checkScrollPosition();
      
      // Window resize re-trigger
      window.addEventListener('resize', checkScrollPosition);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [items, isLoading]);

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      // Scroll by 80% of client container size for smooth overlap
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/carousel my-8 select-none">
      {title && (
        <h2 className="text-base md:text-lg font-black text-zinc-100 mb-4 px-4 md:px-12 flex items-center gap-2 tracking-wider uppercase border-l-4 border-red-600 pl-2">
          {title}
        </h2>
      )}

      {/* Scroll Left Button */}
      {showLeftArrow && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 bottom-12 top-10 z-10 w-10 md:w-12 bg-black/75 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 rounded-r-md border-r border-y border-zinc-800/40 cursor-pointer"
          aria-label="Scroll Left"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Scroll Right Button */}
      {showRightArrow && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 bottom-12 top-10 z-10 w-10 md:w-12 bg-black/75 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 rounded-l-md border-l border-y border-zinc-800/40 cursor-pointer"
          aria-label="Scroll Right"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Carousel Track Container */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-12 py-2"
        onLoad={checkScrollPosition}
      >
        {isLoading ? (
          Array.from({ length: 8 }).map((_, idx) => <SkeletonCard key={idx} />)
        ) : items && items.length > 0 ? (
          items.map((item) => (
            <MovieCard key={item.id} item={item} typeOverride={typeOverride} />
          ))
        ) : (
          <div className="text-zinc-500 py-12 text-center w-full text-sm">
            No listings available
          </div>
        )}
      </div>
    </div>
  );
}
