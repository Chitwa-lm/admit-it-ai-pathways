import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, User, FileText, Upload, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface ParentNavigationProps {
  userName?: string;
  showQuickActions?: boolean;
}

const ParentNavigation: React.FC<ParentNavigationProps> = ({
  userName,
  showQuickActions = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const quickActions = [
    {
      label: 'Portal',
      href: '/parent-portal',
      icon: User,
      description: 'Parent dashboard',
    },
    {
      label: 'Apply',
      href: '/application',
      icon: FileText,
      description: 'Start application',
    },
    {
      label: 'Documents',
      href: '/documents',
      icon: Upload,
      description: 'Upload documents',
    },
    {
      label: 'Find Schools',
      href: '/dashboard',
      icon: Search,
      description: 'Search schools',
    },
  ];

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBackToPortal = () => {
    if (location.pathname !== '/parent-portal') {
      navigate('/parent-portal');
    }
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              size="sm"
              className="text-blue-700 hover:text-blue-900"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            
            {location.pathname !== '/parent-portal' && location.pathname !== '/' && (
              <>
                <span className="text-blue-400">/</span>
                <Button
                  onClick={handleBackToPortal}
                  variant="ghost"
                  size="sm"
                  className="text-blue-700 hover:text-blue-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Parent Portal
                </Button>
              </>
            )}
          </div>

          {userName && (
            <div className="text-right">
              <h2 className="text-sm font-medium text-blue-900">Welcome, {userName}</h2>
              <p className="text-xs text-blue-600">Parent Portal</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className="flex items-center space-x-1 overflow-x-auto">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const active = isActive(action.href);
              
              return (
                <Button
                  key={action.href}
                  asChild
                  variant={active ? 'default' : 'ghost'}
                  size="sm"
                  className={`flex items-center space-x-2 whitespace-nowrap ${
                    active 
                      ? 'bg-blue-600 text-white' 
                      : 'text-blue-700 hover:text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <Link to={action.href}>
                    <Icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentNavigation;