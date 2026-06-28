import React from 'react';

/**
 * RatingBadge displays TMDB vote average values with color indicators
 * @param {number} rating - Vote average from 0 to 10
 */
export default function RatingBadge({ rating }) {
  if (rating === undefined || rating === null || rating === 0) return null;
  
  const value = Number(rating).toFixed(1);
  
  // Decide colors based on rating strength (Netflix style)
  let badgeColors = 'border-red-500 text-red-500 bg-red-500/10';
  if (rating >= 7) {
    badgeColors = 'border-emerald-500 text-emerald-500 bg-emerald-500/10';
  } else if (rating >= 5) {
    badgeColors = 'border-amber-500 text-amber-500 bg-amber-500/10';
  }

  return (
    <div 
      className={`inline-flex items-center justify-center font-black text-xs border px-1.5 py-0.5 rounded-md tracking-wider ${badgeColors}`}
      aria-label={`Rating: ${value} out of 10`}
    >
      ★ {value}
    </div>
  );
}
