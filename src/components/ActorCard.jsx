import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../config/tmdb';

/**
 * ActorCard displays profile photo and name of cast members/actors
 * @param {object} actor - TMDB person object
 */
export default function ActorCard({ actor }) {
  if (!actor) return null;

  const profileUrl = getImageUrl(actor.profile_path, 'w185');
  const character = actor.character;
  const name = actor.name;
  const knownFor = actor.known_for?.map(item => item.title || item.name).join(', ');

  return (
    <Link
      to={`/person/${actor.id}`}
      className="group flex flex-col gap-2 shrink-0 w-32 sm:w-36 md:w-44 select-none overflow-hidden rounded-lg bg-zinc-950/40 border border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-300 pb-2 text-center"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900 rounded-t-lg">
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-zinc-900 text-zinc-500">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">{name}</span>
          </div>
        )}
      </div>

      <div className="px-2">
        <h3 className="text-xs sm:text-sm font-bold text-zinc-200 line-clamp-1 group-hover:text-white transition-colors">
          {name}
        </h3>
        {character ? (
          <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5" title={character}>
            as {character}
          </p>
        ) : knownFor ? (
          <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5" title={knownFor}>
            {knownFor}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
