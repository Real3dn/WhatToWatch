import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import MovieCard from '../../../components/MovieCard';

/**
 * FavoritesPage renders user-favorited Movies & TV Shows from local Zustand store.
 */
export default function FavoritesPage() {
  const favorites = useAppStore((state) => state.favorites);

  return (
    <div className="container mx-auto px-4 md:px-12 py-8 min-h-[70vh] flex flex-col gap-6 select-none">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase border-l-4 border-red-600 pl-2">
          My Favorites
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Movies and shows you marked as favorites.</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
          {favorites.map((item) => (
            <MovieCard key={item.id} item={item} typeOverride={item.media_type} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500 max-w-sm mx-auto flex flex-col items-center gap-4">
          <div className="p-4 bg-zinc-950 rounded-full border border-zinc-850">
            <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-400">No favorites marked yet</h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Tap the heart icon on any poster backdrop or info card to store your favorite releases here.
            </p>
          </div>
          <Link
            to="/"
            className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-6 rounded-md transition duration-200"
          >
            Explore Movies
          </Link>
        </div>
      )}
    </div>
  );
}
