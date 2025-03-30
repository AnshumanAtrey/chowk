
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { useAuth } from '@/contexts/AuthContext';
import { useService } from '@/contexts/ServiceContext';

const reviewFormSchema = z.object({
  rating: z.number().min(1, { message: 'Please select a rating' }).max(5),
  comment: z.string().min(10, { message: 'Review must be at least 10 characters' }),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  serviceId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ serviceId, onReviewSubmitted }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth();
  const { submitReview } = useService();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    if (!session.user) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitReview({
        service_id: serviceId,
        user_id: session.user.id,
        rating: values.rating,
        comment: values.comment,
      });

      form.reset({
        rating: 0,
        comment: '',
      });
      
      onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Write a Review</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <StarRating 
                      rating={field.value} 
                      size="lg"
                      onRatingChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write your review here..." 
                      className="min-h-[100px]" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
