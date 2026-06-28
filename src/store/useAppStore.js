import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      favorites: [], // list of movie/tv objects: { id, title, name, poster_path, media_type, vote_average, release_date, first_air_date }
      watchlist: [], // list of movie/tv objects: { id, title, name, poster_path, media_type, vote_average, release_date, first_air_date }
      recentlyViewed: [], // list of movie/tv objects: { id, title, name, poster_path, media_type, vote_average }
      searchHistory: [], // list of search terms (strings)

      // Favorites Actions
      addFavorite: (item) => {
        const favorites = get().favorites;
        if (!favorites.some((f) => f.id === item.id)) {
          set({ favorites: [item, ...favorites] });
        }
      },
      removeFavorite: (id) => {
        set({ favorites: get().favorites.filter((f) => f.id !== id) });
      },
      isFavorite: (id) => {
        return get().favorites.some((f) => f.id === id);
      },

      // Watchlist Actions
      addToWatchlist: (item) => {
        const watchlist = get().watchlist;
        if (!watchlist.some((w) => w.id === item.id)) {
          set({ watchlist: [item, ...watchlist] });
        }
      },
      removeFromWatchlist: (id) => {
        set({ watchlist: get().watchlist.filter((w) => w.id !== id) });
      },
      isInWatchlist: (id) => {
        return get().watchlist.some((w) => w.id === id);
      },

      // Recently Viewed Actions
      addToRecentlyViewed: (item) => {
        const recentlyViewed = get().recentlyViewed;
        const filtered = recentlyViewed.filter((r) => r.id !== item.id);
        // Keep only the most recent 20 items to prevent local storage bloat
        set({ recentlyViewed: [item, ...filtered].slice(0, 20) });
      },
      clearRecentlyViewed: () => {
        set({ recentlyViewed: [] });
      },

      // Search History Actions
      addToSearchHistory: (query) => {
        const cleanQuery = query?.trim();
        if (!cleanQuery) return;
        
        const searchHistory = get().searchHistory;
        const filtered = searchHistory.filter((q) => q.toLowerCase() !== cleanQuery.toLowerCase());
        // Keep only the most recent 10 search queries
        set({ searchHistory: [cleanQuery, ...filtered].slice(0, 10) });
      },
      removeFromSearchHistory: (query) => {
        set({ searchHistory: get().searchHistory.filter((q) => q.toLowerCase() !== query.toLowerCase()) });
      },
      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },
    }),
    {
      name: 'what-to-watch-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
