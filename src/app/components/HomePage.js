'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Film, TrendingUp, Clock, Star, Filter } from 'lucide-react';
import { fetchMovies } from '../services/movieService';

export default function HomePage({ initialMovies, genres }) {
  const [movies, setMovies] = useState(initialMovies);
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    year: '',
    searchQuery: '',
    page: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Generate years for filter (current year - 20 years)
  const years = Array.from(
    { length: 20 }, 
    (_, i) => new Date().getFullYear() - i
  );

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        const newMovies = await fetchMovies(filters);
        setMovies(newMovies);
      } catch (error) {
        console.error('Error loading movies:', error);
        // Error state handling 
      }
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(loadMovies, 500);
    return () => clearTimeout(debounceTimer);
  }, [filters]);

  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: e.target.value,
      page: 1 // Reset page when searching
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
      page: 1 // Reset page when changing filters
    }));
  };

  const resetFilters = () => {
    setFilters({
      genre: '',
      rating: '',
      year: '',
      searchQuery: '',
      page: 1
    });
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-b from-black/60 to-gray-900">
        <Image
          src="/api/placeholder/1920/1080"
          alt="Pelicula Destacada"
          fill
          priority
          className="object-cover -z-10"
        />
        <div className="container mx-auto px-4 py-20 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Descubre el Cine</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
          Explore miles de películas, obtenga recomendaciones y manténgase al día de los últimos estrenos.
          </p>
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Buscar peliculas..."
              className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={filters.searchQuery}
            />
            <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filter and Movies Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center">
            <Film className="mr-2" /> Peliculas
          </h2>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Genero</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los Generos</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Calificacion Minima</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Cualquier Calificacion</option>
                  <option value="9">9+ ⭐</option>
                  <option value="8">8+ ⭐</option>
                  <option value="7">7+ ⭐</option>
                  <option value="6">6+ ⭐</option>
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Año</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los años</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
                >
                  Borrar Filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition">
                <div className="relative h-[450px]">
                  <Image
                    src={movie.imageUrl || '/api/placeholder/500/750'}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
                    <span className="text-sm text-gray-400">{movie.year}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{movie.genre}</span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span>{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && movies.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No se encontraron peliculas con los filtros seleccionados.
          </div>
        )}
      </section>
    </main>
  );
}