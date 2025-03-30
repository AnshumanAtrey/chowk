
import Layout from '@/components/layout/Layout';
import ServiceForm from '@/components/services/ServiceForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function CreateServicePage() {
  const { session } = useAuth();

  if (!session.user) {
    return <Navigate to="/login?redirect=/services/new" />;
  }

  return (
    <Layout>
      <div className="chowk-container py-10">
        <h1 className="mb-8 text-center text-3xl font-bold">Post a New Service</h1>
        <ServiceForm />
      </div>
    </Layout>
  );
}
