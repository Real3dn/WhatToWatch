import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '../../../services/tmdbService';
import { useDebounce } from '../../../hooks/useDebounce';
import { useAppStore } from '../../../store/useAppStore';
import MovieCard from '../../../components/MovieCard';
import ActorCard from '../../../components/ActorCard';
import SkeletonCard from '../../../components/SkeletonCard';

/**
 * SearchPage handles debounced, real-time multi-category search
 * covering movies, TV shows, and cast personnel.
 */
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(inputQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'movie', 'tv', 'person'

  const { searchHistory, addToSearchHistory, removeFromSearchHistory, clearSearchHistory, recentlyViewed } = useAppStore();

  // Sync URL search params with input query state
  useEffect(() => {
    setInputQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // TanStack Query for debounced multi-search fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => tmdbService.searchMulti(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
  });

  // Add search term to history if results exist
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2 && data?.results?.length > 0) {
      addToSearchHistory(debouncedQuery);
    }
  }, [debouncedQuery, data, addToSearchHistory]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const handleHistoryClick = (term) => {
    setInputQuery(term);
    setSearchParams({ q: term });
  };

  const results = data?.results || [];

  // Filter results locally by category tab
  const filteredResults = results.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.media_type === selectedCategory;
  });

  return (
    <div className="container mx-auto px-4 md:px-12 py-8 min-h-[75vh] flex flex-col gap-6">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto w-full">
        <input
          type="text"
          placeholder="Search movies, TV shows, or actors..."
          value={inputQuery}
          onChange={handleInputChange}
          className="w-full bg-zinc-900 border-2 border-zinc-700 text-white rounded-full px-6 py-3 pl-12 pr-10 focus:outline-none focus:border-red-600 transition-colors duration-200 text-base md:text-lg shadow-lg"
          autoFocus
        />
        <svg className="absolute left-4 top-4 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {inputQuery && (
          <button
            onClick={() => {
              setInputQuery('');
              setSearchParams({});
            }}
            className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            title="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Conditional Rendering: Empty search state (History & Recently Viewed) */}
      {!inputQuery.trim() ? (
        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {/* Search History */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Search History</h2>
              {searchHistory.length > 0 && (
                <button onClick={clearSearchHistory} className="text-xs text-red-500 hover:text-red-400 font-semibold transition">
                  Clear All
                </button>
              )}
            </div>
            {searchHistory.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {searchHistory.map((term, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold pl-3 pr-2 py-1.5 rounded-full transition duration-200 cursor-pointer"
                    onClick={() => handleHistoryClick(term)}
                  >
                    <span>{term}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromSearchHistory(term);
                      }}
                      className="text-zinc-500 hover:text-red-500 transition p-0.5 rounded-full"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic mt-1">Your recent searches will appear here.</p>
            )}
          </div>

          {/* Recently Viewed */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Recently Viewed</h2>
            </div>
            {recentlyViewed.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-1">
                {recentlyViewed.slice(0, 4).map((item) => (
                  <MovieCard key={item.id} item={item} typeOverride={item.media_type} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic mt-1">Movies or shows you inspect will show here.</p>
            )}
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="flex flex-col gap-6">
          {/* Category Filter Tabs */}
          {results.length > 0 && !isLoading && (
            <div className="flex justify-center border-b border-zinc-800 pb-px">
              <div className="flex gap-6 md:gap-8 text-sm font-bold tracking-wide">
                {[
                  { id: 'all', label: 'All Results' },
                  { id: 'movie', label: 'Movies' },
                  { id: 'tv', label: 'TV Shows' },
                  { id: 'person', label: 'People' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`pb-2.5 transition relative cursor-pointer ${
                      selectedCategory === tab.id
                        ? 'text-white border-b-2 border-red-600'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Grid / Loading / Error states */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-500 font-semibold">Error retrieving search results. Please try again.</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
              {filteredResults.map((item) => {
                if (item.media_type === 'person') {
                  return <ActorCard key={item.id} actor={item} />;
                }
                return <MovieCard key={item.id} item={item} typeOverride={item.media_type} />;
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-zinc-500">
              <svg className="w-12 h-12 mx-auto text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-bold text-zinc-400">No results found</h3>
              <p className="text-sm text-zinc-500 max-w-xs mx-auto mt-1">
                Try checking for typos or searching for a different keyword.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
