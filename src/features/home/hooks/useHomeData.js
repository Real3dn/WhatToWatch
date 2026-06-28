import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '../../../services/tmdbService';

/**
 * Custom hook to aggregate queries for the Netflix-style Home feed.
 * Utilizes caching and stale times configured globally in QueryClient.
 */
export function useHomeData() {
  const trendingMovies = useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: () => tmdbService.getTrendingMovies('week'),
  });

  const trendingTv = useQuery({
    queryKey: ['tv', 'trending'],
    queryFn: () => tmdbService.getTrendingTv('week'),
  });

  const popularMovies = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: () => tmdbService.getPopularMovies(1),
  });

  const topRatedMovies = useQuery({
    queryKey: ['movies', 'topRated'],
    queryFn: () => tmdbService.getTopRatedMovies(1),
  });

  const upcomingMovies = useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: () => tmdbService.getUpcomingMovies(1),
  });

  const nowPlayingMovies = useQuery({
    queryKey: ['movies', 'nowPlaying'],
    queryFn: () => tmdbService.getNowPlayingMovies(1),
  });

  const isLoading =
    trendingMovies.isLoading ||
    trendingTv.isLoading ||
    popularMovies.isLoading ||
    topRatedMovies.isLoading ||
    upcomingMovies.isLoading ||
    nowPlayingMovies.isLoading;

  const isError =
    trendingMovies.isError ||
    trendingTv.isError ||
    popularMovies.isError ||
    topRatedMovies.isError ||
    upcomingMovies.isError ||
    nowPlayingMovies.isError;

  return {
    trendingMovies: trendingMovies.data || [],
    trendingTv: trendingTv.data || [],
    popularMovies: popularMovies.data || [],
    topRatedMovies: topRatedMovies.data || [],
    upcomingMovies: upcomingMovies.data || [],
    nowPlayingMovies: nowPlayingMovies.data || [],
    isLoading,
    isError,
  };
}
