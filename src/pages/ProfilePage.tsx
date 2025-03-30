
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileUpload } from '@/components/ui/file-upload';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { session, signOut } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState(session.profile?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(session.profile?.avatar_url || '');

  if (!session.user) {
    return <Navigate to="/login?redirect=/profile" />;
  }

  const handleUpdateProfile = async () => {
    if (!session.user) return;
    
    setIsUpdating(true);
    
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date(),
        })
        .eq('id', session.user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      // Reload page to refresh auth context
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };

  return (
    <Layout>
      <div className="chowk-container py-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-center text-3xl font-bold">Your Profile</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-lg">
                    {fullName.charAt(0) || session.user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="mt-4 w-full max-w-sm">
                  <FileUpload 
                    onUploadComplete={handleAvatarUpload} 
                    initialImage={avatarUrl}
                  />
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={session.user.email || ''}
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
              <Button
                onClick={handleUpdateProfile}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
