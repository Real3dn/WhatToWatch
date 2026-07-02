# What To Watch

A premium Netflix-inspired Movie Discovery web application built with React, Vite, Tailwind CSS, and TanStack Query. Designed for portfolio demonstration.

## Features

- **Dynamic Homepage**: High-impact hero banner, trailer video modal overlay, and scrolling category carousels.
- **Advanced Search**: Live search with category breakdown (Movies, TV Shows, People) and persistent search history.
- **Discovery Engine**: Custom genre toggles with infinite scroll pagination, language filters, release year, and ratings thresholds.
- **Zustand State Store**: Synchronized and persisted Watchlist and Favorites items in LocalStorage.
- **Deep Integrations**: Actor biographies, complete TV/Movie details, interactive carousels, and external public rating systems (IMDb, Rotten Tomatoes, Letterboxd).

## Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Data Fetching**: Axios + TanStack Query (React Query)
- **Quality Tools**: ESLint + Prettier

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your TMDB API Key:
   ```env
   VITE_TMDB_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
