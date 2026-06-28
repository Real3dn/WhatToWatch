import { Link } from 'react-router-dom';
import { getImageUrl } from '../../../config/tmdb';
import { useAppStore } from '../../../store/useAppStore';
import RatingBadge from '../../../components/RatingBadge';

/**
 * HeroBanner renders a cinematic header showing details of a featured movie.
 * @param {object} movie - Movie object to feature
 * @param {boolean} isLoading - Loading status for skeleton view
 */
export default function HeroBanner({ movie, isLoading }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();

  if (isLoading) {
    return (
      <div className="relative h-[60vh] md:h-[75vh] w-full bg-zinc-900 animate-pulse flex flex-col justify-end px-4 md:px-12 pb-16 md:pb-24 gap-4">
        <div className="h-10 bg-zinc-800 rounded w-2/5 animate-pulse" />
        <div className="h-5 bg-zinc-800 rounded w-1/4 animate-pulse" />
        <div className="h-16 bg-zinc-800 rounded w-3/5 animate-pulse" />
        <div className="flex gap-4">
          <div className="h-10 bg-zinc-800 rounded w-32 animate-pulse" />
          <div className="h-10 bg-zinc-800 rounded w-32 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const { title, overview, backdrop_path, id, vote_average, release_date } = movie;
  const backdropUrl = getImageUrl(backdrop_path, 'original');
  const releaseYear = release_date ? new Date(release_date).getFullYear() : '';

  const inWatchlist = isInWatchlist(id);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist({
        id,
        title,
        poster_path: movie.poster_path,
        media_type: 'movie',
        vote_average,
        release_date,
      });
    }
  };

  return (
    <div className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden select-none">
      {/* Background Poster/Backdrop Image with Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover object-top brightness-[0.55] transition-opacity duration-1000 ease-in"
          />
        ) : (
          <div className="w-full h-full bg-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-neutral-900 to-transparent" />
      </div>

      {/* Movie Details Layer */}
      <div className="relative z-10 max-w-4xl h-full flex flex-col justify-end px-4 md:px-12 pb-16 md:pb-24 gap-4">
        <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-tight max-w-2xl text-white drop-shadow-md">
          {title}
        </h1>

        <div className="flex items-center gap-3">
          <RatingBadge rating={vote_average} />
          {releaseYear && <span className="text-sm font-semibold text-zinc-300">{releaseYear}</span>}
          <span className="text-xs uppercase font-extrabold tracking-widest text-red-500 border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 rounded">
            Featured
          </span>
        </div>

        <p className="text-sm md:text-base text-zinc-300 max-w-xl line-clamp-3 leading-relaxed drop-shadow-sm">
          {overview}
        </p>

        {/* Dynamic CTAs */}
        <div className="flex items-center gap-4 mt-2">
          <Link
            to={`/movie/${id}`}
            className="flex items-center justify-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 transition font-bold py-2.5 px-6 rounded-md shadow-md text-sm md:text-base cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Trailer
          </Link>
          
          <button
            onClick={handleWatchlistToggle}
            className={`flex items-center justify-center gap-2 font-bold py-2.5 px-6 rounded-md text-sm md:text-base border cursor-pointer transition-all duration-200 ${
              inWatchlist
                ? 'bg-zinc-800/80 hover:bg-zinc-700/80 text-yellow-500 border-zinc-700'
                : 'bg-zinc-900/60 hover:bg-zinc-800/60 text-white border-zinc-500 hover:border-white'
            }`}
          >
            {inWatchlist ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                In Watchlist
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                Add Watchlist
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
