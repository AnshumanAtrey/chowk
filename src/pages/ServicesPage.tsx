
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceFilterBar from '@/components/services/ServiceFilterBar';
import { Button } from '@/components/ui/button';
import { useService } from '@/contexts/ServiceContext';
import { SearchFilters } from '@/types';

export default function ServicesPage() {
  const location = useLocation();
  const { services, loading, totalCount, fetchServices } = useService();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const pageSize = 9;
  
  useEffect(() => {
    // Extract filter parameters from URL
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('query') || '';
    const categoryParam = searchParams.get('category') || '';
    const cityParam = searchParams.get('city') || '';
    
    const newFilters = {
      query: queryParam,
      category: categoryParam !== "_all" ? categoryParam : '',
      city: cityParam !== "_all" ? cityParam : '',
    };
    
    setFilters(newFilters);
    setCurrentPage(1);
    fetchServices(1, pageSize, newFilters);
  }, [location.search]);
  
  const handleFilterChange = (newFilters: SearchFilters) => {
    // Convert "_all" values to empty strings for the backend
    const processedFilters = {
      ...newFilters,
      category: newFilters.category === "_all" ? "" : newFilters.category,
      city: newFilters.city === "_all" ? "" : newFilters.city
    };
    
    setFilters(processedFilters);
    setCurrentPage(1);
    fetchServices(1, pageSize, processedFilters);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchServices(page, pageSize, filters);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Layout>
      <ServiceFilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
      
      <div className="chowk-container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            All Services
            {Object.values(filters).some(Boolean) && ' (Filtered)'}
          </h1>
          <p className="text-gray-600">
            {totalCount} {totalCount === 1 ? 'service' : 'services'} found
          </p>
        </div>
        
        {loading && services.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-lg text-gray-500">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center">
            <p className="mb-4 text-lg text-gray-500">No services found matching your criteria.</p>
            <Button onClick={() => handleFilterChange({})}>Clear Filters</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      onClick={() => handlePageChange(index + 1)}
                      className={currentPage === index + 1 ? "bg-chowk-primary" : ""}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
