
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      toast({
        title: "Email sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="chowk-container py-16 flex flex-col items-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            {!isSuccess && (
              <p className="mt-2 text-gray-600">
                Enter your email and we'll send you a link to reset your password.
              </p>
            )}
          </div>
          
          {isSuccess ? (
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
              <Mail className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Check your email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <div className="space-y-4">
                <Button variant="outline" className="w-full" onClick={() => setIsSuccess(false)}>
                  Try another email
                </Button>
                <Button asChild variant="link" className="w-full">
                  <Link to="/login">Return to login</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
              
              <div className="text-center">
                <Button asChild variant="link">
                  <Link to="/login" className="inline-flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
                  </Link>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
