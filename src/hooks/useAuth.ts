
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for mock auth in localStorage first
    const mockAuth = localStorage.getItem('mockAuth');
    if (mockAuth) {
      const mockUser = JSON.parse(mockAuth);
      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      setLoading(false);
      return;
    }

    // Set up auth state listener for real Supabase auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const mockSignIn = async (email: string, password: string) => {
    // Mock authentication for development
    const mockUser = {
      id: 'mock-user-id',
      email: email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        first_name: 'Mock',
        last_name: 'User'
      }
    };
    
    localStorage.setItem('mockAuth', JSON.stringify(mockUser));
    setUser(mockUser as User);
    setSession({ user: mockUser } as Session);
    
    return { data: { user: mockUser }, error: null };
  };

  const signOut = async () => {
    // Clear mock auth
    localStorage.removeItem('mockAuth');
    
    // Clear real auth
    const { error } = await supabase.auth.signOut();
    
    // Reset state
    setUser(null);
    setSession(null);
    
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    mockSignIn,
    signOut,
  };
};
