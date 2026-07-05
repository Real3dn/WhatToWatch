import tmdbClient from '../config/tmdb';

export const tmdbService = {
  // --- FEED LISTS ---
  getTrendingMovies: async (timeWindow = 'week') => {
    const { data } = await tmdbClient.get(`/trending/movie/${timeWindow}`);
    return data.results;
  },

  getTrendingTv: async (timeWindow = 'week') => {
    const { data } = await tmdbClient.get(`/trending/tv/${timeWindow}`);
    return data.results;
  },

  getPopularMovies: async (page = 1) => {
    const { data } = await tmdbClient.get('/movie/popular', { params: { page } });
    return data.results;
  },

  getPopularTv: async (page = 1) => {
    const { data } = await tmdbClient.get('/tv/popular', { params: { page } });
    return data.results;
  },

  getTopRatedMovies: async (page = 1) => {
    const { data } = await tmdbClient.get('/movie/top_rated', { params: { page } });
    return data.results;
  },

  getTopRatedTv: async (page = 1) => {
    const { data } = await tmdbClient.get('/tv/top_rated', { params: { page } });
    return data.results;
  },

  getUpcomingMovies: async (page = 1) => {
    const { data } = await tmdbClient.get('/movie/upcoming', { params: { page } });
    return data.results;
  },

  getNowPlayingMovies: async (page = 1) => {
    const { data } = await tmdbClient.get('/movie/now_playing', { params: { page } });
    return data.results;
  },

  // --- DETAILS ---
  getMovieDetails: async (id) => {
    const { data } = await tmdbClient.get(`/movie/${id}`, {
      params: {
        append_to_response: 'videos,credits,reviews,recommendations,similar,images',
      },
    });
    return data;
  },

  getTvDetails: async (id) => {
    const { data } = await tmdbClient.get(`/tv/${id}`, {
      params: {
        append_to_response: 'videos,credits,reviews,recommendations,similar,images,external_ids',
      },
    });
    return data;
  },

  getActorDetails: async (id) => {
    const { data } = await tmdbClient.get(`/person/${id}`, {
      params: {
        append_to_response: 'combined_credits,images',
      },
    });
    return data;
  },

  // --- SEARCH ---
  searchMulti: async (query, page = 1) => {
    const { data } = await tmdbClient.get('/search/multi', {
      params: { query, page },
    });
    return data;
  },

  // --- GENRES ---
  getMovieGenres: async () => {
    const { data } = await tmdbClient.get('/genre/movie/list');
    return data.genres;
  },

  getTvGenres: async () => {
    const { data } = await tmdbClient.get('/genre/tv/list');
    return data.genres;
  },

  // --- DISCOVER / ADVANCED FILTERING ---
  discoverContent: async (type = 'movie', params = {}) => {
    const { data } = await tmdbClient.get(`/discover/${type}`, { params });
    return data;
  },
};
