
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState, UserProfile } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  session: AuthState;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });
  const [loading, setLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          setSession({
            user: currentSession.user,
            profile: profile || null,
            loading: false,
          });
        } else {
          setSession({ user: null, profile: null, loading: false });
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setSession({ user: null, profile: null, loading: false });
      }
      setLoading(false);
    };

    fetchSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (currentSession?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        setSession({
          user: currentSession.user,
          profile: profile || null,
          loading: false,
        });
      } else {
        setSession({ user: null, profile: null, loading: false });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        // Create a profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              full_name: fullName,
              email: email
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast({
            title: "Profile creation failed",
            description: "Your account was created but we couldn't set up your profile. Please try signing in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created",
            description: "Please check your email to verify your account",
          });
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setSession({ user: null, profile: null, loading: false });
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "An error occurred while signing out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
