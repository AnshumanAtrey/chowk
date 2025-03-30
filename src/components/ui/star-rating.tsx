
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  className,
  onRatingChange
}: StarRatingProps) {
  const sizesMap = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSize = sizesMap[size];
  const isInteractive = !!onRatingChange;

  return (
    <div className={cn('flex', className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= rating;
        
        return (
          <span
            key={index}
            className={cn(
              'inline-flex',
              isInteractive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
            onClick={isInteractive ? () => onRatingChange(starValue) : undefined}
          >
            <Star
              className={cn(
                iconSize,
                filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              )}
            />
          </span>
        );
      })}
    </div>
  );
}
