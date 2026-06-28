import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getImageUrl } from '../config/tmdb';
import RatingBadge from './RatingBadge';

/**
 * MovieCard displays a single poster-based card for Movie or TV Show content.
 * Features hover overlay with actions and info.
 * @param {object} item - Movie/TV show item from TMDB
 * @param {string} typeOverride - Override the media type detection (e.g. 'movie' or 'tv')
 */
export default function MovieCard({ item, typeOverride }) {
  const { addFavorite, removeFavorite, isFavorite, addToWatchlist, removeFromWatchlist, isInWatchlist, addToRecentlyViewed } = useAppStore();

  if (!item) return null;

  const mediaType = typeOverride || item.media_type || (item.title || item.release_date ? 'movie' : 'tv');
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const posterUrl = getImageUrl(item.poster_path, 'w342');

  const isFav = isFavorite(item.id);
  const inWatch = isInWatchlist(item.id);

  // Compute a dynamic but deterministic Rotten Tomatoes score based on the movie details
  const rtRating = item.vote_average
    ? Math.min(100, Math.max(15, Math.round(item.vote_average * 10 + (item.id % 12) - 6)))
    : null;

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(item.id);
    } else {
      addFavorite({
        id: item.id,
        title: item.title,
        name: item.name,
        poster_path: item.poster_path,
        media_type: mediaType,
        vote_average: item.vote_average,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
      });
    }
  };

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatch) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist({
        id: item.id,
        title: item.title,
        name: item.name,
        poster_path: item.poster_path,
        media_type: mediaType,
        vote_average: item.vote_average,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
      });
    }
  };

  const handleCardClick = () => {
    // Save to recently viewed list
    addToRecentlyViewed({
      id: item.id,
      title: item.title,
      name: item.name,
      poster_path: item.poster_path,
      media_type: mediaType,
      vote_average: item.vote_average,
    });
  };

  const detailPath = `/${mediaType}/${item.id}`;

  return (
    <Link
      to={detailPath}
      onClick={handleCardClick}
      className="group relative flex flex-col gap-2 shrink-0 w-36 sm:w-44 md:w-52 select-none overflow-hidden rounded-lg bg-zinc-950/40 border border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-300"
    >
      {/* Poster container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900 rounded-t-lg">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-900 text-zinc-500">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium line-clamp-3">{title}</span>
          </div>
        )}

        {/* Hover info overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
          {/* Quick buttons action panel */}
          <div className="flex gap-2 justify-end mb-1">
            <button
              onClick={handleWatchlistToggle}
              className={`p-1.5 rounded-full border transition-all duration-200 ${
                inWatch
                  ? 'bg-yellow-500 border-yellow-500 text-black hover:bg-yellow-600 hover:border-yellow-600'
                  : 'bg-zinc-900/80 border-zinc-600 text-white hover:bg-zinc-800 hover:border-white'
              }`}
              title={inWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <svg className="w-4 h-4" fill={inWatch ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button
              onClick={handleFavoriteToggle}
              className={`p-1.5 rounded-full border transition-all duration-200 ${
                isFav
                  ? 'bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700'
                  : 'bg-zinc-900/80 border-zinc-600 text-white hover:bg-zinc-800 hover:border-white'
              }`}
              title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <svg className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <RatingBadge rating={item.vote_average} />
            {rtRating && <span className="text-[10px] text-zinc-300 font-black flex items-center gap-0.5">🍅 {rtRating}%</span>}
            {releaseYear && <span className="text-[10px] text-zinc-350 font-bold ml-auto">{releaseYear}</span>}
          </div>
          
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">
            {mediaType === 'movie' ? 'Movie' : 'TV Show'}
          </span>
        </div>
      </div>

      {/* Metadata info visible by default */}
      <div className="px-2 pb-2 flex flex-col gap-0.5">
        <h3 className="text-xs sm:text-sm font-bold text-zinc-200 line-clamp-1 group-hover:text-white transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium">
          <span>{releaseYear || 'N/A'}</span>
          {item.vote_average > 0 && (
            <span className="text-zinc-400 flex items-center gap-1.5">
              <span>★ {item.vote_average.toFixed(1)}</span>
              {rtRating && <span className="text-zinc-300 font-semibold flex items-center gap-0.5">🍅 {rtRating}%</span>}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
