
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import { Review } from '@/types';
import { useService } from '@/contexts/ServiceContext';
import { format } from 'date-fns';

interface ReviewListProps {
  serviceId: string;
  newReviewSubmitted: boolean;
}

export default function ReviewList({ serviceId, newReviewSubmitted }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { getReviewsByServiceId } = useService();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await getReviewsByServiceId(serviceId);
      if (data) {
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [serviceId, newReviewSubmitted]);

  if (loading) {
    return <div className="py-6 text-center text-gray-500">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        No reviews yet. Be the first to review this service!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={review.user_profile?.avatar_url} />
                <AvatarFallback>
                  {review.user_profile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-gray-900">
                  {review.user_profile?.full_name || 'Anonymous User'}
                </h4>
                <div className="mt-1 flex items-center space-x-2">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-sm text-gray-500">
                    {review.created_at && format(new Date(review.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
