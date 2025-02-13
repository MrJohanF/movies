// src\app\page.js


import { fetchMovies, fetchGenres } from './services/movieService';
import HomePage from './components/HomePage';

export default async function Home() {
  const [movies, genres] = await Promise.all([
    fetchMovies({}),
    fetchGenres()
  ]);
  
  return <HomePage initialMovies={movies} genres={genres} />;
}