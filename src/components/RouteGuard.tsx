import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getRedirectRoute } from '@/lib/utils/navigation';
import { toast } from 'sonner';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const redirectRoute = getRedirectRoute(user, location.pathname);
      
      if (redirectRoute) {
        // Add a small delay to avoid redirect loops and let the page load first
        const timer = setTimeout(() => {
          // Show a toast message explaining the redirect
          const isAdminRedirect = redirectRoute === '/admin';
          toast.info(
            isAdminRedirect 
              ? 'Redirecting to Admin Dashboard' 
              : 'Redirecting to Parent Portal',
            {
              description: isAdminRedirect
                ? 'Admin users should use the admin dashboard'
                : 'Parent users should use the parent portal'
            }
          );
          
          navigate(redirectRoute, { replace: true });
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [user, location.pathname, navigate]);

  return <>{children}</>;
};

export default RouteGuard;