import React from 'react';
import { useHomeData } from '../hooks/useHomeData';
import HeroBanner from '../components/HeroBanner';
import SectionCarousel from '../../../components/SectionCarousel';

/**
 * HomePage renders the Netflix-style Dashboard.
 * Integrates Hero banner and horizontally scrollable carousels.
 */
export default function HomePage() {
  const {
    trendingMovies,
    trendingTv,
    popularMovies,
    topRatedMovies,
    upcomingMovies,
    nowPlayingMovies,
    isLoading,
    isError,
  } = useHomeData();

  // Handle API connection errors gracefully
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="bg-red-950/20 border border-red-500/30 p-6 md:p-8 rounded-lg max-w-md">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Failed to load content</h2>
          <p className="text-sm text-zinc-400 mb-6">
            There was an issue connecting to the movie database service. Please check your internet connection or verify your TMDB API Key.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Select the primary trending movie as our Hero feature banner
  const featuredMovie = trendingMovies?.[0] || popularMovies?.[0] || null;

  return (
    <div className="relative overflow-hidden bg-neutral-900 pb-12 -mt-20">
      {/* Hero Header Banner */}
      <HeroBanner movie={featuredMovie} isLoading={isLoading} />

      {/* Carousels List Layer */}
      <div className="relative z-20 md:-mt-16 flex flex-col gap-2">
        <SectionCarousel
          title="Trending Movies"
          items={trendingMovies}
          isLoading={isLoading}
          typeOverride="movie"
        />

        <SectionCarousel
          title="Trending TV Shows"
          items={trendingTv}
          isLoading={isLoading}
          typeOverride="tv"
        />

        <SectionCarousel
          title="Popular Movies"
          items={popularMovies}
          isLoading={isLoading}
          typeOverride="movie"
        />

        <SectionCarousel
          title="Top Rated Movies"
          items={topRatedMovies}
          isLoading={isLoading}
          typeOverride="movie"
        />

        <SectionCarousel
          title="Upcoming Movies"
          items={upcomingMovies}
          isLoading={isLoading}
          typeOverride="movie"
        />

        <SectionCarousel
          title="Now Playing Movies"
          items={nowPlayingMovies}
          isLoading={isLoading}
          typeOverride="movie"
        />
      </div>
    </div>
  );
}
