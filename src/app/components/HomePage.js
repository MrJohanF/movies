'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Star, X, TrendingUp, Calendar, Clock } from 'lucide-react';
import { fetchMovies } from '../services/movieService';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage({ initialMovies, genres }) {
  const [movies, setMovies] = useState(initialMovies);
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    year: '',
    searchQuery: '',
    page: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [offsetY, setOffsetY] = useState(0);

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

  // Parallax Effect for Hero Image
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore scroll position if saved when returning from detail view
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('homeScrollPosition');
    if (savedScroll) {
      window.scrollTo(0, Number(savedScroll));
      sessionStorage.removeItem('homeScrollPosition');
    }
  }, []);

  // Fetch movies when filters or activeTab changes
  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        const newMovies = await fetchMovies({ ...filters, category: activeTab });
        setMovies(newMovies);
      } catch (error) {
        console.error('Error loading movies:', error);
      }
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(loadMovies, 500);
    return () => clearTimeout(debounceTimer);
  }, [filters, activeTab]);

  const handleSearch = (e) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: e.target.value,
      page: 1,
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      genre: '',
      rating: '',
      year: '',
      searchQuery: '',
      page: 1,
    });
  };

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section with Parallax */}
      <div className="relative h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ transform: `translateY(${offsetY * 0.5}px)` }}
        >
          <Image
            src="/background.jpg"
            alt="Featured Movie"
            fill
            priority
            className="object-cover transition-transform duration-500 ease-out"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/90 to-gray-900" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500">
              Descubre el Cine
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 max-w-2xl">
              Explora miles de películas, obtén recomendaciones personalizadas y mantente al día con los últimos estrenos.
            </p>
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Buscar películas..."
                className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={handleSearch}
                value={filters.searchQuery}
              />
              <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
              title: 'En tendencia',
              value: '2.7k Peliculas',
              bg: 'bg-blue-500/20',
            },
            {
              icon: <Calendar className="w-6 h-6 text-purple-500" />,
              title: 'Nuevos Lanzamientos',
              value: '485 Esta Semana',
              bg: 'bg-purple-500/20',
            },
            {
              icon: <Clock className="w-6 h-6 text-green-500" />,
              title: 'Horas de Contenido',
              value: '1.2M Horas',
              bg: 'bg-green-500/20',
            },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${stat.bg}`}>{stat.icon}</div>
                <div>
                  <p className="text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Movies Section with Tabs and Filters */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Custom Tabs */}
          <div className="flex bg-gray-800/50 rounded-lg p-1 gap-1">
            {['all', 'trending', 'new', 'top'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.target.blur();
                  setActiveTab(tab);
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {isFilterOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            {isFilterOpen ? 'Cerrar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 mb-8 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Género</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full bg-gray-700/50 rounded-lg px-3 py-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Todos los Géneros</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Calificación Mínima</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full bg-gray-700/50 rounded-lg px-3 py-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Cualquier Calificación</option>
                  {[9, 8, 7, 6].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}+ ⭐
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Año</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full bg-gray-700/50 rounded-lg px-3 py-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Todos los Años</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Borrar Filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Movies Grid with Smooth Fade Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + JSON.stringify(filters)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {movies.map((movie) => (
              <Link
                href={`/movie/${movie.id}`}
                key={movie.id}
                onClick={() => {
                  // Save the current scroll position before navigating to detail view
                  sessionStorage.setItem('homeScrollPosition', window.screenY);
                }}
                className="group bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={movie.imageUrl || '/api/placeholder/500/750'}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {movie.title}
                    </h3>
                    <span className="text-sm text-gray-400">{movie.year}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{movie.genre}</span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-1" />
                      <span>{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Optionally, if you want a spinner overlay during loading */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </section>
    </motion.main>
  );
}
