
import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ServiceForm from '@/components/services/ServiceForm';
import { useAuth } from '@/contexts/AuthContext';
import { useService } from '@/contexts/ServiceContext';
import { Service } from '@/types';
import { AlertTriangle } from 'lucide-react';

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();
  const { getServiceById } = useService();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const serviceData = await getServiceById(id);
        
        if (!serviceData) {
          setError('Service not found');
          return;
        }
        
        // Check if user is the owner
        if (session.user && serviceData.user_id !== session.user.id) {
          setError('You do not have permission to edit this service');
          return;
        }
        
        setService(serviceData);
      } catch (err: any) {
        console.error('Error fetching service:', err);
        setError(err.message || 'An error occurred while fetching the service');
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [id, session.user]);

  if (!session.user) {
    return <Navigate to={`/login?redirect=/services/edit/${id}`} />;
  }

  if (loading) {
    return (
      <Layout>
        <div className="chowk-container py-10">
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-lg text-gray-500">Loading service...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="chowk-container py-10">
          <div className="flex flex-col items-center justify-center h-[400px]">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              {error || 'Service not found'}
            </h1>
            <p className="text-gray-600 mb-6">
              {error ? 'You cannot edit this service.' : 'The service you are trying to edit does not exist or has been removed.'}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-chowk-primary text-white rounded-md hover:bg-chowk-secondary transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="chowk-container py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Service</h1>
        <ServiceForm serviceToEdit={service} isEditing={true} />
      </div>
    </Layout>
  );
}
