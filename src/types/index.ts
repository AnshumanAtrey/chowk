
export interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  email?: string;
  created_at: string;
}

export interface Service {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  contact_email: string;
  contact_phone?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  user_profile?: UserProfile;
  average_rating?: number;
}

export interface Review {
  id: string;
  service_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user_profile?: UserProfile;
}

export interface ServiceRequest {
  id: string;
  service_id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  city?: string;
}

// Categories and Cities for dropdown
export const CATEGORIES = [
  { value: 'business', label: 'Business' },
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'writing', label: 'Writing' },
  { value: 'education', label: 'Education' },
  { value: 'music', label: 'Music' },
  { value: 'video', label: 'Video' },
  { value: 'photography', label: 'Photography' },
  { value: 'other', label: 'Other' }
];

export const CITIES = [
  { value: 'new-york', label: 'New York' },
  { value: 'london', label: 'London' },
  { value: 'paris', label: 'Paris' },
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'berlin', label: 'Berlin' },
  { value: 'sydney', label: 'Sydney' },
  { value: 'toronto', label: 'Toronto' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'dubai', label: 'Dubai' },
  { value: 'other', label: 'Other' }
];
