import Image from 'next/image';
import { Star } from 'lucide-react';
import { useState } from 'react';

export default function ReviewCard({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentPreview = review.content.slice(0, 300);
  const needsExpansion = review.content.length > 300;

  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 flex-shrink-0">
          {review.avatarUrl ? (
            <Image
              src={review.avatarUrl}
              alt={review.author}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-gray-400">
                {review.author[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{review.author}</h3>
            {review.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <span>{review.rating}/10</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-400">{review.createdAt}</p>
        </div>
      </div>

      <div className="text-gray-300">
        <p>
          {isExpanded ? review.content : contentPreview}
          {!isExpanded && needsExpansion && '...'}
        </p>
        {needsExpansion && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 hover:text-blue-300 text-sm mt-2"
          >
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>
    </div>
  );
}