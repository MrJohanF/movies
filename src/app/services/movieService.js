// src/app/services/movieService.js

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;

export const getImageUrl = (path, size = 'original') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export async function fetchMovies({ page = 1, genre = '', searchQuery = '', year = '' }) {
  let url;
  
  if (searchQuery) {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
  } else {
    url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`;
    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&year=${year}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  return data.results.map(movie => ({
    id: movie.id,
    title: movie.title,
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : '0.0',
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
    imageUrl: getImageUrl(movie.poster_path, 'w500'),
    backdropUrl: getImageUrl(movie.backdrop_path, 'original'),
  }));
}

export async function fetchMovieDetails(id) {
  try {
    const [movieResponse, creditsResponse] = await Promise.all([
      fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`),
      fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`)
    ]);

    if (!movieResponse.ok || !creditsResponse.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const movieData = await movieResponse.json();
    const creditsData = await creditsResponse.json();

    return {
      id: movieData.id,
      title: movieData.title,
      rating: movieData.vote_average ? movieData.vote_average.toFixed(1) : '0.0',
      year: movieData.release_date ? new Date(movieData.release_date).getFullYear() : 'N/A',
      duration: movieData.runtime ? `${movieData.runtime}min` : 'N/A',
      genre: movieData.genres ? movieData.genres.map(g => g.name) : [],
      director: creditsData.crew?.find(person => person.job === 'Director')?.name || 'N/A',
      cast: creditsData.cast?.slice(0, 5).map(person => person.name) || [],
      synopsis: movieData.overview || 'No hay sinopsis disponible.',
      imageUrl: getImageUrl(movieData.poster_path, 'w500'),
      backdropUrl: getImageUrl(movieData.backdrop_path, 'original'),
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

export async function fetchGenres() {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await response.json();
  return data.genres;
}