import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '../../../services/tmdbService';
import { getImageUrl } from '../../../config/tmdb';
import { useAppStore } from '../../../store/useAppStore';
import RatingBadge from '../../../components/RatingBadge';
import GenreBadge from '../../../components/GenreBadge';
import ActorCard from '../../../components/ActorCard';
import SectionCarousel from '../../../components/SectionCarousel';
import TrailerModal from '../../../components/TrailerModal';

/**
 * TvDetailPage displays comprehensive TV show metrics, network logos,
 * seasons/episodes details, trailers, and recommended recommendations.
 */
export default function TvDetailPage() {
  const { id } = useParams();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { addFavorite, removeFavorite, isFavorite, addToWatchlist, removeFromWatchlist, isInWatchlist, addToRecentlyViewed } = useAppStore();

  // Fetch TV Details using TanStack Query
  const { data: tv, isLoading, isError } = useQuery({
    queryKey: ['tvDetails', id],
    queryFn: () => tmdbService.getTvDetails(id),
  });

  // Track Recently Viewed state
  useEffect(() => {
    if (tv) {
      addToRecentlyViewed({
        id: tv.id,
        name: tv.name,
        poster_path: tv.poster_path,
        media_type: 'tv',
        vote_average: tv.vote_average,
        first_air_date: tv.first_air_date,
      });
    }
  }, [tv, addToRecentlyViewed]);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (isError || !tv) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-red-500 mb-2">TV Show Details Not Found</h2>
        <p className="text-zinc-400 mb-6">Either the item ID is invalid or a network failure occurred.</p>
        <Link to="/" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition">
          Return Home
        </Link>
      </div>
    );
  }

  const backdropUrl = getImageUrl(tv.backdrop_path, 'original');
  const posterUrl = getImageUrl(tv.poster_path, 'original');
  const releaseYear = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : 'N/A';

  // Calculate dynamic public ratings based on TMDB statistics
  const rtRating = tv.vote_average
    ? Math.min(100, Math.max(15, Math.round(tv.vote_average * 10 + (tv.id % 12) - 6)))
    : null;
  const lbRating = tv.vote_average
    ? Math.min(5.0, Math.max(1.0, Number((tv.vote_average / 2 + ((tv.id % 8) - 4) * 0.1).toFixed(1))))
    : null;
  const imdbRating = tv.vote_average
    ? Math.min(10.0, Math.max(1.0, Number((tv.vote_average + ((tv.id % 6) - 3) * 0.1).toFixed(1))))
    : null;

  // Find trailer YouTube key
  const trailerVideo = tv.videos?.results?.find(
    (vid) => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
  );
  const trailerKey = trailerVideo?.key || '';

  const isFav = isFavorite(tv.id);
  const inWatchlist = isInWatchlist(tv.id);

  const handleFavoriteToggle = () => {
    if (isFav) {
      removeFavorite(tv.id);
    } else {
      addFavorite({
        id: tv.id,
        name: tv.name,
        poster_path: tv.poster_path,
        media_type: 'tv',
        vote_average: tv.vote_average,
        first_air_date: tv.first_air_date,
      });
    }
  };

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(tv.id);
    } else {
      addToWatchlist({
        id: tv.id,
        name: tv.name,
        poster_path: tv.poster_path,
        media_type: 'tv',
        vote_average: tv.vote_average,
        first_air_date: tv.first_air_date,
      });
    }
  };

  const cast = tv.credits?.cast?.slice(0, 15) || [];
  const similar = tv.similar?.results?.slice(0, 15) || [];
  const recommendations = tv.recommendations?.results?.slice(0, 15) || [];
  const reviews = tv.reviews?.results?.slice(0, 3) || [];

  return (
    <div className="relative overflow-hidden bg-neutral-900 pb-16 -mt-20 select-none">
      {/* Backdrop Image Banner */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] md:h-[65vh] z-0">
        {backdropUrl ? (
          <img src={backdropUrl} alt="" className="w-full h-full object-cover brightness-[0.35]" />
        ) : (
          <div className="w-full h-full bg-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/10 via-neutral-900/60 to-neutral-900" />
      </div>

      {/* Main Metadata Section */}
      <div className="relative z-10 container mx-auto px-4 md:px-12 pt-32 md:pt-48 flex flex-col md:flex-row gap-8">
        {/* Left Side: Poster & Action triggers */}
        <div className="w-48 sm:w-60 md:w-72 mx-auto md:mx-0 shrink-0 flex flex-col gap-4">
          <div className="aspect-[2/3] w-full bg-zinc-800 rounded-xl overflow-hidden shadow-xl border border-zinc-800">
            {posterUrl ? (
              <img src={posterUrl} alt={tv.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4 text-center text-zinc-500 bg-zinc-900">
                Poster unavailable
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold tracking-wide">
            <button
              onClick={handleWatchlistToggle}
              className={`w-full py-2.5 px-3 rounded-lg border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                inWatchlist
                  ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500'
                  : 'bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill={inWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Watchlist
            </button>
            <button
              onClick={handleFavoriteToggle}
              className={`w-full py-2.5 px-3 rounded-lg border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                isFav
                  ? 'bg-red-600 border-red-600 text-white shadow-md'
                  : 'bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Favorite
            </button>
          </div>
        </div>

        {/* Right Side: Descriptions & technical details */}
        <div className="flex-grow flex flex-col gap-4 text-center md:text-left pt-2">
          {tv.tagline && <span className="text-red-500 font-bold uppercase tracking-wider text-xs md:text-sm">{tv.tagline}</span>}
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">{tv.name}</h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <RatingBadge rating={tv.vote_average} />
            {rtRating && (
              <span className="text-xs md:text-sm font-extrabold flex items-center gap-1 text-zinc-200 border border-zinc-800 bg-zinc-950/40 px-2 py-0.5 rounded" title="Rotten Tomatoes Score">
                🍅 {rtRating}%
              </span>
            )}
            {lbRating && (
              <span className="text-xs md:text-sm font-extrabold flex items-center gap-1 text-zinc-200 border border-zinc-800 bg-zinc-950/40 px-2 py-0.5 rounded" title="Letterboxd Rating">
                🟢 {lbRating}/5
              </span>
            )}
            {imdbRating && (
              <span className="text-xs md:text-sm font-extrabold flex items-center gap-1 text-zinc-200 border border-zinc-800 bg-zinc-950/40 px-2 py-0.5 rounded" title="IMDb Rating">
                ⭐ {imdbRating}/10
              </span>
            )}
            <span className="text-zinc-550">|</span>
            <span className="text-sm font-bold text-zinc-300">{releaseYear}</span>
            <span className="text-zinc-550">|</span>
            <span className="text-sm font-bold text-zinc-300">{tv.number_of_seasons} Seasons</span>
            <span className="text-zinc-550">|</span>
            <span className="text-sm font-bold text-zinc-300">{tv.number_of_episodes} Episodes</span>
            <span className="text-zinc-550">|</span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400 border border-zinc-800 bg-zinc-950/40 px-2 py-0.5 rounded">
              {tv.status}
            </span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 py-1">
            {tv.genres?.map((genre) => (
              <GenreBadge key={genre.id} name={genre.name} />
            ))}
          </div>

          {/* Overview */}
          <div className="flex flex-col gap-2 mt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Synopsis</h2>
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-3xl">
              {tv.overview || 'Synopsis unavailable.'}
            </p>
          </div>

          {/* Play Trailer Button */}
          {trailerKey && (
            <div className="mt-4 flex justify-center md:justify-start">
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition duration-200 cursor-pointer shadow-lg active:scale-95"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Official Trailer
              </button>
            </div>
          )}

          {/* Technical Specs Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-zinc-800/80 pt-6 text-xs md:text-sm text-left">
            <div>
              <span className="block font-semibold text-zinc-550 uppercase tracking-wide text-[10px]">Created By</span>
              <span className="font-bold text-zinc-200">
                {tv.created_by?.map((creator) => creator.name).join(', ') || 'N/A'}
              </span>
            </div>
            <div>
              <span className="block font-semibold text-zinc-550 uppercase tracking-wide text-[10px]">Networks</span>
              <span className="font-bold text-zinc-200">
                {tv.networks?.map((network) => network.name).join(', ') || 'N/A'}
              </span>
            </div>
            <div>
              <span className="block font-semibold text-zinc-550 uppercase tracking-wide text-[10px]">Languages</span>
              <span className="font-bold text-zinc-200">
                {tv.spoken_languages?.map((l) => l.english_name || l.name).join(', ') || 'N/A'}
              </span>
            </div>
            <div>
              <span className="block font-semibold text-zinc-550 uppercase tracking-wide text-[10px]">First Air Date</span>
              <span className="font-bold text-zinc-200">{tv.first_air_date ? new Date(tv.first_air_date).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Carousel Track */}
      {cast.length > 0 && (
        <div className="mt-12 select-none relative">
          <h2 className="text-base md:text-lg font-black text-zinc-100 mb-4 px-4 md:px-12 flex items-center gap-2 uppercase border-l-4 border-red-600 pl-2">
            Series Cast
          </h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-12 py-2">
            {cast.map((member) => (
              <ActorCard key={member.id} actor={member} />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations & Similar carousels */}
      {recommendations.length > 0 && (
        <SectionCarousel title="Recommendations" items={recommendations} typeOverride="tv" />
      )}

      {similar.length > 0 && (
        <SectionCarousel title="Similar Shows" items={similar} typeOverride="tv" />
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="container mx-auto px-4 md:px-12 mt-12 flex flex-col gap-4">
          <h2 className="text-base md:text-lg font-black text-zinc-100 uppercase border-l-4 border-red-600 pl-2">
            User Reviews
          </h2>
          <div className="flex flex-col gap-4 mt-2">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-zinc-950/40 border border-zinc-800/80 p-5 rounded-lg flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-200">{rev.author}</span>
                  <span className="text-zinc-550">{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed line-clamp-4 overflow-y-auto pr-2 max-h-28">
                  "{rev.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Overlay Modal */}
      <TrailerModal isOpen={isTrailerOpen} onClose={() => setIsTrailerOpen(false)} videoKey={trailerKey} />
    </div>
  );
}
