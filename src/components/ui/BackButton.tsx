import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getSmartBackRoute } from '@/lib/utils/navigation';

interface BackButtonProps {
  to?: string;
  label?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showHome?: boolean;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  to,
  label,
  variant = 'ghost',
  size = 'default',
  showHome = false,
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      // Use smart back navigation utility
      const backRoute = getSmartBackRoute(user, location.pathname, window.history.length > 1);
      
      if (backRoute === 'back') {
        navigate(-1);
      } else {
        navigate(backRoute);
      }
    }
  };

  const getDefaultLabel = () => {
    if (showHome) return 'Home';
    if (to) {
      // Generate label based on destination
      switch (to) {
        case '/': return 'Home';
        case '/parent-portal': return 'Parent Portal';
        case '/admin': return 'Admin Dashboard';
        case '/dashboard': return 'Dashboard';
        default: return 'Back';
      }
    }
    return 'Back';
  };

  return (
    <Button
      onClick={handleBack}
      variant={variant}
      size={size}
      className={`flex items-center space-x-2 ${className}`}
    >
      {showHome ? (
        <Home className="h-4 w-4" />
      ) : (
        <ArrowLeft className="h-4 w-4" />
      )}
      <span>{label || getDefaultLabel()}</span>
    </Button>
  );
};

export default BackButton;