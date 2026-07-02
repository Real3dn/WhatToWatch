import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '../../../services/tmdbService';
import { getImageUrl } from '../../../config/tmdb';
import MovieCard from '../../../components/MovieCard';

/**
 * ActorDetailPage displays personal actor bios, birth stats, and a list of combined credits.
 */
export default function ActorDetailPage() {
  const { id } = useParams();

  // Fetch Actor Details using TanStack Query
  const { data: actor, isLoading, isError } = useQuery({
    queryKey: ['actorDetails', id],
    queryFn: () => tmdbService.getActorDetails(id),
  });

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

  if (isError || !actor) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Actor Details Not Found</h2>
        <p className="text-zinc-400 mb-6">Either the profile ID is invalid or a network timeout occurred.</p>
        <Link to="/" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition">
          Return Home
        </Link>
      </div>
    );
  }

  const profileUrl = getImageUrl(actor.profile_path, 'h632');
  const photos = actor.images?.profiles?.slice(0, 12) || [];
  
  // Extract combined credits and sort by popularity (descending)
  const filmography = actor.combined_credits?.cast
    ? [...actor.combined_credits.cast]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20)
    : [];

  const age = actor.birthday
    ? new Date().getFullYear() - new Date(actor.birthday).getFullYear()
    : null;

  return (
    <div className="container mx-auto px-4 md:px-12 py-8 select-none">
      {/* Top Bio Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Photo */}
        <div className="w-48 sm:w-60 md:w-72 shrink-0 mx-auto md:mx-0">
          <div className="aspect-[2/3] w-full bg-zinc-800 rounded-xl overflow-hidden shadow-xl border border-zinc-800">
            {profileUrl ? (
              <img src={profileUrl} alt={actor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4 text-center text-zinc-500 bg-zinc-900">
                Photo unavailable
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="mt-6 flex flex-col gap-3 text-xs md:text-sm bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-lg">
            <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-850 pb-1">Personal Info</h3>
            <div>
              <span className="block font-semibold text-zinc-550 uppercase tracking-wide text-[9px]">Known For</span>
              <span className="font-bold text-zinc-200">{actor.known_for_department || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-semibold text-zinc-550 uppercase tracking-wide text-[9px]">Birthday</span>
              <span className="font-bold text-zinc-200">
                {actor.birthday ? `${new Date(actor.birthday).toLocaleDateString()} ${age ? `(Age ${age})` : ''}` : 'N/A'}
              </span>
            </div>
            {actor.deathday && (
              <div>
                <span className="block font-semibold text-zinc-550 uppercase tracking-wide text-[9px]">Died</span>
                <span className="font-bold text-zinc-200">{new Date(actor.deathday).toLocaleDateString()}</span>
              </div>
            )}
            <div>
              <span className="block font-semibold text-zinc-550 uppercase tracking-wide text-[9px]">Place of Birth</span>
              <span className="font-bold text-zinc-200">{actor.place_of_birth || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="flex-grow flex flex-col gap-4 text-left">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">{actor.name}</h1>

          <div className="flex flex-col gap-2 mt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Biography</h2>
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-4xl whitespace-pre-line max-h-96 overflow-y-auto pr-3">
              {actor.biography || `We don't have a biography for ${actor.name} yet.`}
            </p>
          </div>
        </div>
      </div>

      {/* Filmography Section */}
      {filmography.length > 0 && (
        <div className="mt-12 select-none relative">
          <h2 className="text-base md:text-lg font-black text-zinc-100 mb-4 flex items-center gap-2 uppercase border-l-4 border-red-600 pl-2">
            Known For (Filmography)
          </h2>
          <div className="flex gap-4 overflow-x-auto scroll-smooth py-2 pb-4">
            {filmography.map((item) => (
              <MovieCard key={`${item.id}-${item.media_type}`} item={item} typeOverride={item.media_type} />
            ))}
          </div>
        </div>
      )}

      {/* Photos Carousel Section */}
      {photos.length > 0 && (
        <div className="mt-12 select-none relative">
          <h2 className="text-base md:text-lg font-black text-zinc-100 mb-4 flex items-center gap-2 uppercase border-l-4 border-red-600 pl-2">
            Photos ({photos.length})
          </h2>
          <div className="flex gap-4 overflow-x-auto scroll-smooth py-2 pb-4">
            {photos.map((img, index) => (
              <div key={index} className="w-32 sm:w-40 shrink-0 aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden border border-zinc-850">
                <img
                  src={getImageUrl(img.file_path, 'w185')}
                  alt={`${actor.name} profile`}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
