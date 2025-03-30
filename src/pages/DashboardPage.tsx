
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ServiceCard from '@/components/services/ServiceCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useService } from '@/contexts/ServiceContext';
import { PlusCircle } from 'lucide-react';
import { Service } from '@/types';

export default function DashboardPage() {
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const { getUserServices } = useService();

  useEffect(() => {
    const fetchUserServices = async () => {
      if (!session.user) return;
      
      try {
        setLoading(true);
        const { data } = await getUserServices(session.user.id);
        
        if (data) {
          setUserServices(data);
        }
      } catch (error) {
        console.error('Error fetching user services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserServices();
  }, [session.user]);

  if (!session.user) {
    return <Navigate to="/login?redirect=/dashboard" />;
  }

  return (
    <Layout>
      <div className="chowk-container py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Manage your service listings and account
            </p>
          </div>
          <Button asChild>
            <Link to="/services/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Post New Service
            </Link>
          </Button>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Your Services</h2>
          
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-gray-500">Loading your services...</p>
            </div>
          ) : userServices.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="mb-2 text-lg font-medium text-gray-900">No services yet</h3>
              <p className="mb-4 text-gray-600">
                You haven't posted any services yet. Create your first service listing to get started.
              </p>
              <Button asChild>
                <Link to="/services/new">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Post Your First Service
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
