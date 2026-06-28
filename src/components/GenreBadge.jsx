import React from 'react';

/**
 * GenreBadge displays a styled category tag. Optional click action for routing.
 * @param {string} name - Genre name
 * @param {function} onClick - Optional click callback
 */
export default function GenreBadge({ name, onClick, className = '' }) {
  if (!name) return null;
  const isClickable = !!onClick;

  return (
    <span
      onClick={isClickable ? onClick : undefined}
      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 select-none transition-all duration-200 ${
        isClickable
          ? 'cursor-pointer hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-95'
          : ''
      } ${className}`}
    >
      {name}
    </span>
  );
}
