
-- Update services table to correctly link to reviews
ALTER TABLE public.reviews 
  DROP CONSTRAINT IF EXISTS reviews_service_id_fkey;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_service_id_fkey 
  FOREIGN KEY (service_id) 
  REFERENCES public.services(id) 
  ON DELETE CASCADE;

-- Create a trigger to delete related reviews when a service is deleted
CREATE OR REPLACE FUNCTION delete_related_reviews()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.reviews WHERE service_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS delete_service_reviews ON public.services;

CREATE TRIGGER delete_service_reviews
BEFORE DELETE ON public.services
FOR EACH ROW
EXECUTE FUNCTION delete_related_reviews();

-- Create a trigger to delete related service requests when a service is deleted
CREATE OR REPLACE FUNCTION delete_related_service_requests()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.service_requests WHERE service_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS delete_service_requests ON public.services;

CREATE TRIGGER delete_service_requests
BEFORE DELETE ON public.services
FOR EACH ROW
EXECUTE FUNCTION delete_related_service_requests();
