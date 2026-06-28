import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Lazy load pages for performance optimization & code-splitting
const HomePage = lazy(() => import('../features/home/pages/HomePage'));
const MovieDetailPage = lazy(() => import('../features/movies/pages/MovieDetailPage'));
const TvDetailPage = lazy(() => import('../features/tv/pages/TvDetailPage'));
const ActorDetailPage = lazy(() => import('../features/actors/pages/ActorDetailPage'));
const SearchPage = lazy(() => import('../features/search/pages/SearchPage'));
const GenresPage = lazy(() => import('../features/discover/pages/GenresPage'));
const TrendingPage = lazy(() => import('../features/movies/pages/TrendingPage'));
const PopularPage = lazy(() => import('../features/movies/pages/PopularPage'));
const TopRatedPage = lazy(() => import('../features/movies/pages/TopRatedPage'));
const UpcomingPage = lazy(() => import('../features/movies/pages/UpcomingPage'));
const FavoritesPage = lazy(() => import('../features/list-manager/pages/FavoritesPage'));
const WatchlistPage = lazy(() => import('../features/list-manager/pages/WatchlistPage'));
const NotFoundPage = lazy(() => import('../components/NotFoundPage'));

// Elegant spinner fallback for route transitions
function RouteLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movie/:id" element={<MovieDetailPage />} />
          <Route path="tv/:id" element={<TvDetailPage />} />
          <Route path="person/:id" element={<ActorDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="genres" element={<GenresPage />} />
          <Route path="trending" element={<TrendingPage />} />
          <Route path="popular" element={<PopularPage />} />
          <Route path="top-rated" element={<TopRatedPage />} />
          <Route path="upcoming" element={<UpcomingPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
