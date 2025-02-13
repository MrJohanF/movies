# 🎬 Movie App

A modern and responsive movie application built with Next.js 13, featuring movie details, trailers, reviews, and more. The application uses The Movie Database (TMDB) API to fetch movie data.

## 🌟 Features

- 🎥 Browse movies by different categories (Trending, New, Top Rated, All)
- 🔍 Search functionality for finding specific movies
- 📊 Filter movies by genre and year
- 📽️ Detailed movie information including:
  - Cast and crew details
  - Movie trailers
  - User reviews
  - Movie ratings and runtime
- ❤️ Like/favorite functionality
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations

## 🚀 Technologies Used

- [Next.js 13](https://nextjs.org/) - React framework with App Router
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev/) - Icon library
- [TMDB API](https://www.themoviedb.org/documentation/api) - Movie database API

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18.0.0 or later
- A TMDB API key (get one [here](https://www.themoviedb.org/documentation/api))

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/movie-app.git
cd movie-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your TMDB API credentials:
```env
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
movie-app/
├── app/
│   ├── layout.js
│   ├── page.js
├── components/
│   ├── MovieCard.jsx
│   ├── TrailerModal.jsx
│   └── ReviewCard.jsx
├── services/
│   └── movieService.js
├── movie/[id]/
│   ├── movieService.js
│   ├── page.js
└── public/
    └── assets/
```

## 🔧 Configuration

The application uses environment variables for configuration. Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

## 🎯 API Endpoints

The application uses the following TMDB API endpoints:

- `/services/movieServices` - Get movie data

## 🌐 Environment Setup

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)
- Large screens (1280px and up)

## 🔄 State Management

- React's built-in useState and useEffect hooks for local state management
- Efficient data fetching with Next.js
- Optimized performance with proper loading states

## 🎨 Styling

The project uses Tailwind CSS for styling with:
- Custom color schemes
- Responsive design utilities
- Dark mode by default
- Custom animations
- Consistent spacing and typography

## 🚀 Deployment

The application can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Other Platforms
Ensure your deployment platform supports:
- Node.js 18+
- Environment variables
- API routes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the API
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel](https://vercel.com/) for hosting and deployment solutions

## 📧 Contact

Johan Fernandez - hjfernandez@ucompensar.edu.co

Project Link: [https://github.com/mrjohanf/movie-app](https://github.com/mrjohanf/movies)