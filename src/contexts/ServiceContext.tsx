import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Service, SearchFilters, Review, ServiceRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ServiceContextType {
  services: Service[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  fetchServices: (page?: number, pageSize?: number, filters?: SearchFilters) => Promise<void>;
  getServiceById: (id: string) => Promise<Service | null>;
  createService: (serviceData: Partial<Service>) => Promise<{ data: Service | null; error: any }>;
  updateService: (id: string, serviceData: Partial<Service>) => Promise<{ data: Service | null; error: any }>;
  deleteService: (id: string) => Promise<{ error: any }>;
  submitReview: (review: Partial<Review>) => Promise<{ data: Review | null; error: any }>;
  getReviewsByServiceId: (serviceId: string) => Promise<{ data: Review[] | null; error: any }>;
  submitServiceRequest: (request: Partial<ServiceRequest>) => Promise<{ data: ServiceRequest | null; error: any }>;
  getUserServices: (userId: string) => Promise<{ data: Service[] | null; error: any }>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchServices = async (page = 1, pageSize = 9, filters: SearchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('services')
        .select('*, reviews!reviews_service_id_fkey(rating)', { count: 'exact' });

      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      if (filters.category && filters.category !== "_all") {
        query = query.eq('category', filters.category);
      }

      if (filters.city && filters.city !== "_all") {
        query = query.eq('city', filters.city);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      const processedData = data.map(service => {
        let avgRating = 0;
        if (service.reviews && service.reviews.length > 0) {
          avgRating = service.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / service.reviews.length;
        }
        
        return {
          ...service,
          average_rating: parseFloat(avgRating.toFixed(1))
        } as Service;
      });

      setServices(processedData);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError(err.message);
      toast({
        title: "Error loading services",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceById = async (id: string): Promise<Service | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          reviews!reviews_service_id_fkey(rating)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) return null;

      let avgRating = 0;
      if (data.reviews && data.reviews.length > 0) {
        avgRating = data.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / data.reviews.length;
      }

      return {
        ...data,
        average_rating: parseFloat(avgRating.toFixed(1))
      } as Service;
    } catch (err: any) {
      console.error('Error fetching service:', err);
      toast({
        title: "Error loading service",
        description: err.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Partial<Service>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error creating service",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }

      toast({
        title: "Service created",
        description: "Your service listing has been created successfully.",
      });

      return { data, error: null };
    } catch (err: any) {
      console.error('Error creating service:', err);
      toast({
        title: "Error creating service",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error updating service",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }

      toast({
        title: "Service updated",
        description: "Your service listing has been updated successfully.",
      });

      return { data, error: null };
    } catch (err: any) {
      console.error('Error updating service:', err);
      toast({
        title: "Error updating service",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting service",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Service deleted",
        description: "Your service listing has been deleted successfully.",
      });

      return { error: null };
    } catch (err: any) {
      console.error('Error deleting service:', err);
      toast({
        title: "Error deleting service",
        description: err.message,
        variant: "destructive",
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (reviewData: Partial<Review>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error submitting review",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }

      toast({
        title: "Review submitted",
        description: "Your review has been submitted successfully.",
      });

      return { data, error: null };
    } catch (err: any) {
      console.error('Error submitting review:', err);
      toast({
        title: "Error submitting review",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const getReviewsByServiceId = async (serviceId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`*`)
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      toast({
        title: "Error loading reviews",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const submitServiceRequest = async (requestData: Partial<ServiceRequest>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_requests')
        .insert(requestData)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error submitting request",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }

      toast({
        title: "Request submitted",
        description: "Your service request has been submitted successfully. The freelancer will contact you shortly.",
      });

      return { data, error: null };
    } catch (err: any) {
      console.error('Error submitting service request:', err);
      toast({
        title: "Error submitting request",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const getUserServices = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          reviews!reviews_service_id_fkey(rating)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const processedData = data.map(service => {
        let avgRating = 0;
        if (service.reviews && service.reviews.length > 0) {
          avgRating = service.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / service.reviews.length;
        }
        return {
          ...service,
          average_rating: parseFloat(avgRating.toFixed(1))
        } as Service;
      });

      return { data: processedData, error: null };
    } catch (err: any) {
      console.error('Error fetching user services:', err);
      toast({
        title: "Error loading your services",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceContext.Provider value={{
      services,
      loading,
      error,
      totalCount,
      fetchServices,
      getServiceById,
      createService,
      updateService,
      deleteService,
      submitReview,
      getReviewsByServiceId,
      submitServiceRequest,
      getUserServices
    }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};
