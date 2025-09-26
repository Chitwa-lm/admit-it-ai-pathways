// Navigation utilities for role-based routing

import { User } from '@supabase/supabase-js';

export interface NavigationUtils {
  isAdmin: (user: User | null) => boolean;
  getPortalRoute: (user: User | null) => string;
  getPortalLabel: (user: User | null) => string;
  getHomeRoute: (user: User | null) => string;
  getUserRole: (user: User | null) => 'admin' | 'parent' | 'guest';
}

export const navigationUtils: NavigationUtils = {
  isAdmin: (user: User | null) => {
    if (!user) return false;
    
    // Check for super admin email
    if (user.email === 'chitwamakupe15@gmail.com') return true;
    
    // Check for admin roles in metadata
    const role = user.user_metadata?.role;
    return role === 'admin' || 
           role === 'school_admin' || 
           role === 'admissions_officer' || 
           role === 'system_admin';
  },

  getPortalRoute: (user: User | null) => {
    return navigationUtils.isAdmin(user) ? '/admin' : '/parent-portal';
  },

  getPortalLabel: (user: User | null) => {
    return navigationUtils.isAdmin(user) ? 'Admin Dashboard' : 'Parent Portal';
  },

  getHomeRoute: (user: User | null) => {
    if (!user) return '/';
    return navigationUtils.isAdmin(user) ? '/admin' : '/parent-portal';
  },

  getUserRole: (user: User | null) => {
    if (!user) return 'guest';
    return navigationUtils.isAdmin(user) ? 'admin' : 'parent';
  },
};

// Hook for easy access to navigation utilities
export const useNavigationUtils = () => {
  return navigationUtils;
};

// Route guards
export const getRedirectRoute = (user: User | null, currentPath: string) => {
  // Temporarily disable automatic redirects to dissue
  
  
  const role = navigationUtils.getUserRole(user);
  
  // Only redirect if parent user specifically tries to access admin dashboard
  if (role === 'parent' && currentPath === '/admin') {
    return '/parent-ortal';
  }
  
  // Don't redirect admin users automatically - let them navigate freely
  // This prevents issues with the login flow
  
  rneeded
};

// Smart back navigation
export const getSmartBackRoute = (user: User | null, currentPath: string, hasHistory: boolean) => {
  // If there's browser history, use it
  if (hasHistory) {
    return 'back';
  }
  
  // Otherwise, route to appropriate home based on user role and current path
  const role = navigationUtils.getUserRole(user);
  
  if (currentPath.startsWith('/admin') || role === 'admin') {
    return '/admin';
  }
  
  if (currentPath.startsWith('/parent') || role === 'parent') {
    return '/parent-portal';
  }
  
  return '/';
};