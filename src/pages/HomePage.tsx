
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ServiceCard from '@/components/services/ServiceCard';
import { useService } from '@/contexts/ServiceContext';
import { Search, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/types';

export default function HomePage() {
  const { services, loading, fetchServices } = useService();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices(1, 6);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    
    if (query) {
      navigate(`/services?query=${encodeURIComponent(query)}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-chowk-light to-white py-16 md:py-24">
        <div className="chowk-container">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              Find and Connect with Expert Freelancers
            </h1>
            <p className="mb-8 text-lg text-gray-600 md:text-xl">
              Discover skilled professionals, browse services, and connect directly with freelancers for your projects.
            </p>
            
            <form onSubmit={handleSearch} className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="query"
                  placeholder="What service are you looking for?"
                  className="h-12 w-full rounded-lg border border-gray-300 pl-10 pr-4 focus:border-chowk-primary focus:outline-none focus:ring-2 focus:ring-chowk-primary/50"
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16 bg-white">
        <div className="chowk-container">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Browse Service Categories</h2>
            <p className="mt-3 text-gray-600">Find the perfect freelancers for your project needs</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.slice(0, 8).map((category) => (
              <Link
                key={category.value}
                to={`/services?category=${category.value}`}
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-chowk-primary hover:shadow-md"
              >
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{category.label}</h3>
                <p className="mt-1 text-sm text-gray-500">Find experts</p>
              </Link>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link to="/services" className="inline-flex items-center">
                View All Services
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gray-50">
        <div className="chowk-container">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Services</h2>
              <p className="mt-2 text-gray-600">Discover top-rated services from our community</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/services">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-20 text-center text-gray-500">
                Loading services...
              </div>
            ) : services.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-500">
                No services available yet.
              </div>
            ) : (
              services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-chowk-primary py-16 text-white">
        <div className="chowk-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to share your expertise?</h2>
            <p className="mb-8 text-lg opacity-90">
              Join our community of professionals and offer your services to clients looking for your skills.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-chowk-primary hover:bg-gray-100">
                <Link to="/register">Sign Up Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/services">Browse Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="chowk-container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">How Chowk Works</h2>
            <p className="mt-3 text-gray-600">Simple steps to connect freelancers and clients</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-chowk-light text-chowk-primary">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Find Services</h3>
              <p className="text-gray-600">
                Browse and search for the services you need from our community of skilled professionals.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-chowk-light text-chowk-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                  <line x1="6" x2="6" y1="2" y2="4"></line>
                  <line x1="10" x2="10" y1="2" y2="4"></line>
                  <line x1="14" x2="14" y1="2" y2="4"></line>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Request Services</h3>
              <p className="text-gray-600">
                Contact freelancers directly through our simple request system to discuss your project needs.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-chowk-light text-chowk-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Complete Projects</h3>
              <p className="text-gray-600">
                Work directly with freelancers to complete your project and leave reviews about your experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
