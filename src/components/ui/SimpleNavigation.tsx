import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SimpleNavigationProps {
  title?: string;
  backTo?: string;
  backLabel?: string;
  showHome?: boolean;
  className?: string;
}

const SimpleNavigation: React.FC<SimpleNavigationProps> = ({
  title,
  backTo,
  backLabel = 'Back',
  showHome = true,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showHome && (
            <Button
              onClick={handleHome}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          )}
          
          {backTo && (
            <>
              {showHome && <span className="text-gray-400">/</span>}
              <Button
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {backLabel}
              </Button>
            </>
          )}
        </div>

        {title && (
          <div className="text-right">
            <h2 className="text-sm font-medium text-gray-900">{title}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleNavigation;