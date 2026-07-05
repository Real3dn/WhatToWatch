import axios from 'axios';

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || '4c3336fe';
const BASE_URL = 'https://www.omdbapi.com';

export const omdbService = {
  /**
   * Fetch ratings and extra metadata from OMDb by IMDb ID
   * @param {string} imdbId - The IMDb ID (e.g. tt3896198)
   */
  getRatings: async (imdbId) => {
    if (!imdbId) return null;
    
    const { data } = await axios.get(BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        i: imdbId,
      },
    });

    if (data && data.Response === 'True') {
      // Extract ratings: Internet Movie Database, Rotten Tomatoes, Metacritic
      const ratings = {
        imdb: data.imdbRating && data.imdbRating !== 'N/A' ? `${data.imdbRating}/10` : null,
        rottenTomatoes: null,
        metacritic: data.Metascore && data.Metascore !== 'N/A' ? `${data.Metascore}%` : null,
      };

      if (data.Ratings) {
        const rt = data.Ratings.find(r => r.Source === 'Rotten Tomatoes');
        if (rt) {
          ratings.rottenTomatoes = rt.Value;
        }
      }

      return ratings;
    }
    
    return null;
  },
};
