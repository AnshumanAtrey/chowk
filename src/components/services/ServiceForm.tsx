
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Service, CATEGORIES, CITIES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { useAuth } from '@/contexts/AuthContext';
import { useService } from '@/contexts/ServiceContext';

const serviceFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  city: z.string().min(1, { message: 'Please select a city' }),
  contact_email: z.string().email({ message: 'Please enter a valid email' }),
  contact_phone: z.string().optional(),
  image_url: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  serviceToEdit?: Service;
  isEditing?: boolean;
}

export default function ServiceForm({ serviceToEdit, isEditing = false }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth();
  const { createService, updateService } = useService();
  const navigate = useNavigate();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: serviceToEdit?.title || '',
      description: serviceToEdit?.description || '',
      category: serviceToEdit?.category || '',
      city: serviceToEdit?.city || '',
      contact_email: serviceToEdit?.contact_email || session.user?.email || '',
      contact_phone: serviceToEdit?.contact_phone || '',
      image_url: serviceToEdit?.image_url || '',
    },
  });

  const handleImageUpload = (url: string) => {
    form.setValue('image_url', url);
  };

  const onSubmit = async (values: ServiceFormValues) => {
    if (!session.user) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && serviceToEdit) {
        const { error } = await updateService(serviceToEdit.id, {
          ...values,
          user_id: session.user.id,
        });

        if (error) throw error;
        navigate(`/services/${serviceToEdit.id}`);
      } else {
        const { data, error } = await createService({
          ...values,
          user_id: session.user.id,
        });

        if (error) throw error;
        navigate(`/services/${data?.id}`);
      }
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Service' : 'Post New Service'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Professional Web Development" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your service in detail..." 
                      className="min-h-[120px]" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CITIES.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Image (Optional)</FormLabel>
                  <FormControl>
                    <FileUpload 
                      onUploadComplete={handleImageUpload} 
                      initialImage={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Service' : 'Post Service'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
