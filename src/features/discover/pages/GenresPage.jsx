import { useState, useEffect, useRef } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { tmdbService } from '../../../services/tmdbService';
import MovieCard from '../../../components/MovieCard';
import SkeletonCard from '../../../components/SkeletonCard';
import GenreBadge from '../../../components/GenreBadge';

/**
 * GenresPage integrates interactive advanced filters (language, sorting, year, rating)
 * with infinite scroll pagination for content discovery.
 */
export default function GenresPage() {
  const [mediaType, setMediaType] = useState('movie'); // 'movie' or 'tv'
  const [selectedGenre, setSelectedGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const loadMoreRef = useRef(null);

  // 1. Fetch Genres List based on media type
  const { data: genres = [] } = useQuery({
    queryKey: ['genres', mediaType],
    queryFn: () => (mediaType === 'movie' ? tmdbService.getMovieGenres() : tmdbService.getTvGenres()),
  });

  // 2. Fetch Discovered Contents using TanStack Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingContent,
    isError,
  } = useInfiniteQuery({
    queryKey: ['discover', mediaType, selectedGenre, releaseYear, minRating, sortBy, selectedLanguage],
    queryFn: ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        sort_by: sortBy,
        with_genres: selectedGenre || undefined,
        primary_release_year: mediaType === 'movie' ? (releaseYear || undefined) : undefined,
        first_air_date_year: mediaType === 'tv' ? (releaseYear || undefined) : undefined,
        'vote_average.gte': minRating !== '0' ? minRating : undefined,
        with_original_language: selectedLanguage || undefined,
      };
      return tmdbService.discoverContent(mediaType, params);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page;
      const totalPages = lastPage.total_pages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  // 3. Setup Intersection Observer for scroll triggers
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

  // Flatten infinite query pages
  const items = data?.pages?.flatMap((page) => page.results) || [];

  // Generate Year dropdown values (Current down to 1980)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => String(currentYear - i));

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
  ];

  return (
    <div className="container mx-auto px-4 md:px-12 py-8 flex flex-col gap-8 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase border-l-4 border-red-600 pl-2">Discover</h1>
          <p className="text-sm text-zinc-400 mt-1">Explore titles using detailed filters.</p>
        </div>

        {/* Media type toggle switch */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-1 flex items-center font-bold text-xs tracking-wide">
          <button
            onClick={() => {
              setMediaType('movie');
              setSelectedGenre('');
            }}
            className={`px-4 py-2 rounded-md transition duration-200 cursor-pointer ${
              mediaType === 'movie' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            MOVIES
          </button>
          <button
            onClick={() => {
              setMediaType('tv');
              setSelectedGenre('');
            }}
            className={`px-4 py-2 rounded-md transition duration-200 cursor-pointer ${
              mediaType === 'tv' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            TV SHOWS
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 bg-zinc-950/60 border border-zinc-800/80 p-5 rounded-xl shadow-lg text-xs md:text-sm">
        {/* Sort option */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-900 border border-zinc-850 text-white py-2 px-3 rounded focus:outline-none focus:border-red-600 transition"
          >
            <option value="popularity.desc">Popularity (High)</option>
            <option value="vote_average.desc">Rating (High)</option>
            <option value="release_date.desc">Release Date (New)</option>
            <option value="revenue.desc">Revenue (High)</option>
          </select>
        </div>

        {/* Release Year filter */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Release Year</label>
          <select
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            className="bg-zinc-900 border border-zinc-850 text-white py-2 px-3 rounded focus:outline-none focus:border-red-600 transition"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Min Rating filter */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Min Rating</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="bg-zinc-900 border border-zinc-850 text-white py-2 px-3 rounded focus:outline-none focus:border-red-600 transition"
          >
            <option value="0">All Ratings</option>
            <option value="5">★ 5.0+</option>
            <option value="7">★ 7.0+</option>
            <option value="8">★ 8.0+</option>
          </select>
        </div>

        {/* Original Language filter */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-zinc-900 border border-zinc-850 text-white py-2 px-3 rounded focus:outline-none focus:border-red-600 transition"
          >
            <option value="">All Languages</option>
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reset filters button */}
        <div className="flex items-end col-span-2 sm:col-span-1">
          <button
            onClick={() => {
              setReleaseYear('');
              setMinRating('0');
              setSortBy('popularity.desc');
              setSelectedLanguage('');
              setSelectedGenre('');
            }}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded transition duration-200 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Interactive Genre Badges Bar */}
      <div className="flex flex-col gap-2">
        <span className="font-bold text-zinc-400 uppercase tracking-wide text-[10px] pl-1">Genre Category</span>
        <div className="flex flex-wrap gap-2 py-1 max-h-32 overflow-y-auto pr-2">
          <GenreBadge
            name="All Genres"
            onClick={() => setSelectedGenre('')}
            className={selectedGenre === '' ? 'bg-red-600 border-red-600 text-white' : ''}
          />
          {genres.map((g) => (
            <GenreBadge
              key={g.id}
              name={g.name}
              onClick={() => setSelectedGenre(String(g.id))}
              className={selectedGenre === String(g.id) ? 'bg-red-600 border-red-600 text-white' : ''}
            />
          ))}
        </div>
      </div>

      {/* Grid listing content */}
      <div className="flex flex-col gap-6">
        {isLoadingContent && items.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
            {Array.from({ length: 12 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-semibold">Error retrieving content catalog. Please refresh.</p>
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
              {items.map((item) => (
                <MovieCard key={item.id} item={item} typeOverride={mediaType} />
              ))}
            </div>

            {/* Bottom scroll observer target indicator */}
            <div ref={loadMoreRef} className="flex justify-center items-center py-8">
              {isFetchingNextPage ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              ) : hasNextPage ? (
                <p className="text-xs text-zinc-500 italic">Scroll for more...</p>
              ) : (
                <p className="text-xs text-zinc-600 uppercase font-black tracking-widest mt-4">End of Catalogue</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-zinc-500">
            <svg className="w-12 h-12 mx-auto text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-zinc-400">No items match your filters</h3>
            <p className="text-sm text-zinc-550 max-w-xs mx-auto mt-1">
              Try loosening up some parameters or selection criteria to see more lists.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
