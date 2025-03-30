
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Mail, Phone, Calendar, Edit, Trash, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewList from '@/components/reviews/ReviewList';
import ServiceRequestForm from '@/components/services/ServiceRequestForm';
import { useService } from '@/contexts/ServiceContext';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newReviewSubmitted, setNewReviewSubmitted] = useState(false);
  const { getServiceById, deleteService } = useService();
  const { session } = useAuth();
  const navigate = useNavigate();

  const isOwner = session.user && service?.user_id === session.user.id;
  
  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      setLoading(true);
      const serviceData = await getServiceById(id);
      setService(serviceData);
      setLoading(false);
    };
    
    fetchService();
  }, [id]);

  const handleReviewSubmitted = () => {
    setNewReviewSubmitted(prev => !prev);
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteService(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="chowk-container py-16">
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-lg text-gray-500">Loading service details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="chowk-container py-16">
          <div className="flex h-[400px] flex-col items-center justify-center">
            <AlertTriangle className="mb-4 h-16 w-16 text-yellow-500" />
            <h1 className="mb-2 text-2xl font-bold">Service Not Found</h1>
            <p className="mb-6 text-gray-600">The service you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/services">Browse Services</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="chowk-container py-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Badge className="bg-chowk-primary">
                    {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{service.city.charAt(0).toUpperCase() + service.city.slice(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarRating rating={service.average_rating || 0} size="sm" />
                    <span className="text-sm text-gray-500">
                      {service.average_rating ? service.average_rating.toFixed(1) : 'No ratings yet'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <Calendar className="mr-1 inline-block h-4 w-4" />
                  <span>Posted on {format(new Date(service.created_at), 'MMMM d, yyyy')}</span>
                </div>
              </div>

              {isOwner && (
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link to={`/services/edit/${service.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your service listing.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            {/* Service Image */}
            {service.image_url && (
              <div className="mb-6 overflow-hidden rounded-lg border">
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            <Tabs defaultValue="description" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="whitespace-pre-line text-gray-700">{service.description}</p>
                    
                    <div className="mt-6 border-t pt-6">
                      <h3 className="mb-4 text-lg font-semibold">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-700">
                          <Mail className="mr-2 h-5 w-5 text-chowk-primary" />
                          <span>{service.contact_email}</span>
                        </div>
                        {service.contact_phone && (
                          <div className="flex items-center text-gray-700">
                            <Phone className="mr-2 h-5 w-5 text-chowk-primary" />
                            <span>{service.contact_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardContent className="pt-6">
                    {session.user && service.user_id !== session.user.id && (
                      <div className="mb-8">
                        <ReviewForm 
                          serviceId={service.id} 
                          onReviewSubmitted={handleReviewSubmitted} 
                        />
                      </div>
                    )}
                    
                    <div className="border-t pt-6">
                      <h3 className="mb-6 text-lg font-semibold">Customer Reviews</h3>
                      <ReviewList 
                        serviceId={service.id} 
                        newReviewSubmitted={newReviewSubmitted} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-28">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center">
                    <div className="mr-3 h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                      {service.user_profile?.avatar_url ? (
                        <img
                          src={service.user_profile.avatar_url}
                          alt={service.user_profile.full_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-chowk-primary text-white">
                          {service.user_profile?.full_name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {service.user_profile?.full_name || 'Service Provider'}
                      </h3>
                      <p className="text-sm text-gray-500">Service Provider</p>
                    </div>
                  </div>

                  {!isOwner && (
                    <ServiceRequestForm serviceId={service.id} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
