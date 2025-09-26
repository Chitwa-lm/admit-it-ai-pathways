
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
    // Check if this is the super admin email
    const isSuperAdmin = email === 'chitwamakupe15@gmail.com';
    
    // Determine user role based on email or login context
    let userRole = 'parent'; // Default to parent
    if (isSuperAdmin) {
      userRole = 'system_admin';
    } else if (email.includes('admin') || email.includes('school')) {
      userRole = 'school_admin';
    }
    
    // Mock authentication for development - create a properly typed mock user
    const mockUser = {
      id: isSuperAdmin ? 'c7a6b1e4-2d8f-4c3a-9b5e-1f2a3c4d5e6f' : `mock-user-${Date.now()}`,
      email: email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        first_name: isSuperAdmin ? 'Super' : email.split('@')[0].split('.')[0] || 'User',
        last_name: isSuperAdmin ? 'Admin' : email.split('@')[0].split('.')[1] || 'Parent',
        role: userRole
      },
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      phone: null,
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      recovery_sent_at: null,
      new_email: null,
      email_change_sent_at: null,
      new_phone: null,
      phone_change_sent_at: null,
      reauthentication_sent_at: null,
      is_anonymous: false
    } as User;
    
    const mockSession = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockUser
    } as Session;
    
    localStorage.setItem('mockAuth', JSON.stringify(mockUser));
    setUser(mockUser);
    setSession(mockSession);
    
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
