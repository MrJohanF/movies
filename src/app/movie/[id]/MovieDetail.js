'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Calendar, Film, Users, ChevronLeft, Play, Plus, Heart } from 'lucide-react';
import { fetchMovieDetails, fetchMovieTrailer, fetchMovieReviews } from '../../services/movieService';
import { motion } from 'framer-motion';
import TrailerModal from '../../components/TrailerModal';
import ReviewCard from '../../components/ReviewCard';

export default function MovieDetail({ params }) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const [movieData, trailerKey, reviewsData] = await Promise.all([
          fetchMovieDetails(params.id),
          fetchMovieTrailer(params.id),
          fetchMovieReviews(params.id)
        ]);

            setMovie(movieData);
        setTrailerKey(trailerKey);
        setReviews(reviewsData.reviews);
        setTotalReviewPages(reviewsData.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [params.id]);

  const loadMoreReviews = async () => {
    if (isLoadingReviews || reviewsPage >= totalReviewPages) return;
    
    setIsLoadingReviews(true);
    try {
      const nextPage = reviewsPage + 1;
      const reviewsData = await fetchMovieReviews(params.id, nextPage);
      setReviews(prevReviews => [...prevReviews, ...reviewsData.reviews]);
      setReviewsPage(nextPage);
    } catch (err) {
      console.error('Error loading more reviews:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  };


  const handleTrailerClick = () => {
    if (trailerKey) {
      setIsTrailerOpen(true);
    } else {
      alert('Lo siento, no hay trailer disponible para esta película.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error al cargar la pelicula</h1>
          <p className="text-gray-400">{error}</p>
          <Link href="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition">
            Volver al Menu
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <>
    <motion.main
      className="min-h-screen bg-gray-900 text-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section with Backdrop */}
      <div className="relative h-[80vh]">
        <Image
          src={movie.backdropUrl || '/api/placeholder/1920/1080'}
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80" />

        {/* Back Button */}
        <Link 
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-sm rounded-full hover:bg-gray-900/80 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          Atrás
        </Link>

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-12">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* Poster */}
            <div className="relative h-[450px] w-[300px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={movie.imageUrl || '/api/placeholder/500/750'}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{movie.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Film className="w-4 h-4" />
                  <span>{movie.genre.join(", ")}</span>
                </div>
              </div>

              <p className="text-gray-300 mb-8 max-w-2xl">
                {movie.synopsis}
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                onClick={handleTrailerClick}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-full hover:bg-blue-700 transition">
                  <Play className="w-5 h-5" fill="currentColor" />
                  Ver trailer
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-full hover:bg-gray-700 transition">
                  <Plus className="w-5 h-5" />
                  Agregar A Favoritos
                </button>
                <button 
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition ${
                    isLiked ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cast & Crew */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Reparto y Equipo
            </h2>
            <div className="space-y-4">
              {movie.director && (
                <div>
                  <h3 className="text-gray-400 mb-2">Director</h3>
                  <p>{movie.director}</p>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-gray-400 mb-2">Reparto</h3>
                  <ul className="space-y-2">
                    {movie.cast.map((actor, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        {actor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Acerca de la pelicula</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.synopsis}
              </p>
            </div>

            {/* You can add more sections here like Reviews, Similar Movies, etc. */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Detalles de la Pelicula</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-gray-400 mb-1">Año de Lanzamiento</h3>
                  <p>{movie.year}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 mb-1">Duración</h3>
                  <p>{movie.duration}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 mb-1">Calificación</h3>
                  <p className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {movie.rating}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-400 mb-1">Géneros</h3>
                  <p>{movie.genre.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


 {/* Reviews Section */}
 <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Reseñas de Usuarios</h2>
        
        {reviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            
            {reviewsPage < totalReviewPages && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMoreReviews}
                  disabled={isLoadingReviews}
                  className="px-6 py-3 bg-blue-600 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isLoadingReviews ? 'Cargando...' : 'Cargar más reseñas'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No hay reseñas disponibles para esta película.
          </div>
        )}
      </section>



    </motion.main>

<TrailerModal
isOpen={isTrailerOpen}
onClose={() => setIsTrailerOpen(false)}
trailerKey={trailerKey}
/>
</>

  );
}
