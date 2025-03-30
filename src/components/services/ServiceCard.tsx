
import { Link } from 'react-router-dom';
import { StarRating } from '@/components/ui/star-rating';
import { Service } from '@/types';
import { MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export default function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-md', className)}>
      <Link to={`/services/${service.id}`} className="block">
        <div className="relative h-48 w-full bg-gray-100">
          {service.image_url ? (
            <img
              src={service.image_url}
              alt={service.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          <Badge className="absolute top-3 right-3 bg-chowk-primary">
            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-5">
        <Link to={`/services/${service.id}`} className="block">
          <h3 className="mb-2 line-clamp-1 text-xl font-semibold text-gray-900 hover:text-chowk-primary">
            {service.title}
          </h3>
        </Link>

        <div className="mb-3 flex items-center text-sm text-gray-500">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{service.city.charAt(0).toUpperCase() + service.city.slice(1)}</span>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {service.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {service.user_profile?.full_name || 'Anonymous'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <StarRating rating={service.average_rating || 0} size="sm" />
            <span className="text-sm text-gray-500">
              {service.average_rating ? service.average_rating.toFixed(1) : 'New'}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <Link 
          to={`/services/${service.id}`} 
          className="w-full text-center text-sm font-medium text-chowk-primary hover:text-chowk-secondary"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
