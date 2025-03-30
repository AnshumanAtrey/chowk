
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchFilters, CATEGORIES, CITIES } from '@/types';

interface ServiceFilterBarProps {
  onFilterChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export default function ServiceFilterBar({ onFilterChange, initialFilters }: ServiceFilterBarProps) {
  const [query, setQuery] = useState(initialFilters?.query || '');
  const [category, setCategory] = useState(initialFilters?.category || '');
  const [city, setCity] = useState(initialFilters?.city || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL search params on initial render
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('query') || '';
    const categoryParam = searchParams.get('category') || '';
    const cityParam = searchParams.get('city') || '';
    
    setQuery(queryParam);
    setCategory(categoryParam);
    setCity(cityParam);
    
    onFilterChange({
      query: queryParam,
      category: categoryParam,
      city: cityParam,
    });
  }, [location.search]);

  const handleSearch = () => {
    const filters = {
      query,
      category,
      city,
    };
    
    // Update URL with search params
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('query', query);
    if (category) searchParams.set('category', category);
    if (city) searchParams.set('city', city);
    
    navigate({
      pathname: '/services',
      search: searchParams.toString(),
    });
    
    onFilterChange(filters);
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    setQuery('');
    setCategory('');
    setCity('');
    
    navigate('/services');
    
    onFilterChange({});
    setIsFilterOpen(false);
  };

  const hasActiveFilters = query || category || city;

  return (
    <div className="sticky top-16 z-20 bg-white py-4 border-b">
      <div className="chowk-container">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
          
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-chowk-primary text-xs text-white">
                    !
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filter Services</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_all">All Categories</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_all">All Cities</SelectItem>
                      {CITIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <SheetFooter className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-3">
                <Button variant="outline" onClick={handleReset} className="w-full">
                  <X className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
                <Button onClick={handleSearch} className="w-full">
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          <div className="hidden md:block">
            <Select value={category} onValueChange={(value) => {
              setCategory(value);
              onFilterChange({ query, category: value, city });
              
              const searchParams = new URLSearchParams(location.search);
              if (value && value !== "_all") {
                searchParams.set('category', value);
              } else {
                searchParams.delete('category');
              }
              
              navigate({
                pathname: '/services',
                search: searchParams.toString(),
              });
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="hidden md:block">
            <Select value={city} onValueChange={(value) => {
              setCity(value);
              onFilterChange({ query, category, city: value });
              
              const searchParams = new URLSearchParams(location.search);
              if (value && value !== "_all") {
                searchParams.set('city', value);
              } else {
                searchParams.delete('city');
              }
              
              navigate({
                pathname: '/services',
                search: searchParams.toString(),
              });
            }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Cities</SelectItem>
                {CITIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button className="hidden md:flex" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="hidden md:flex"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        
        {/* Active filters summary */}
        {hasActiveFilters && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>Active filters:</span>
            {category && category !== "_all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Category: {CATEGORIES.find(c => c.value === category)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setCategory('');
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.delete('category');
                    navigate({
                      pathname: '/services',
                      search: searchParams.toString(),
                    });
                    onFilterChange({ query, city });
                  }}
                />
              </Badge>
            )}
            {city && city !== "_all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                City: {CITIES.find(c => c.value === city)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setCity('');
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.delete('city');
                    navigate({
                      pathname: '/services',
                      search: searchParams.toString(),
                    });
                    onFilterChange({ query, category });
                  }}
                />
              </Badge>
            )}
            {query && (
              <Badge variant="outline" className="flex items-center gap-1">
                Search: {query}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setQuery('');
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.delete('query');
                    navigate({
                      pathname: '/services',
                      search: searchParams.toString(),
                    });
                    onFilterChange({ category, city });
                  }}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
