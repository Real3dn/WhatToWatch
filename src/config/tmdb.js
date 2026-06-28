import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: 'application/json',
  },
});

// Axios request interceptor to automatically attach authorization details
tmdbClient.interceptors.request.use(
  (config) => {
    // If the Read Access Token is provided and is not a placeholder, use Bearer Authorization
    if (
      READ_ACCESS_TOKEN &&
      READ_ACCESS_TOKEN !== 'your_tmdb_read_access_token_here' &&
      READ_ACCESS_TOKEN.trim() !== ''
    ) {
      config.headers.Authorization = `Bearer ${READ_ACCESS_TOKEN}`;
    } else if (API_KEY && API_KEY !== 'your_tmdb_api_key_here' && API_KEY.trim() !== '') {
      // Otherwise, fallback to the API Key as a query parameter
      config.params = {
        ...config.params,
        api_key: API_KEY,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Constants for image URLs
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
};

export const getImageUrl = (path, size = 'original') => {
  if (!path) return null;
  const imageBase = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
  return `${imageBase}/${size}${path}`;
};

export default tmdbClient;
