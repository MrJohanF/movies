// src/app/movie/[id]/page.js
'use client';

import { use } from 'react';
import MovieDetail from './MovieDetail';

export default function MovieDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  return <MovieDetail params={params} />;
}