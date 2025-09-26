import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Settings, Users, School, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminNavigationProps {
  currentSection?: string;
  schoolName?: string;
  onSectionChange?: (section: string) => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({
  currentSection,
  schoolName,
  onSectionChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'applications',
      label: 'Applications',
      icon: FileText,
      description: 'View and manage applications',
    },
    {
      id: 'schools',
      label: 'Schools Overview',
      icon: School,
      description: 'Quick overview of schools',
    },
    {
      id: 'school-management',
      label: 'School Management',
      icon: Settings,
      description: 'Edit school details and information',
    },
    {
      id: 'available-places',
      label: 'Available Places',
      icon: Users,
      description: 'Manage enrollment capacity',
    },
  ];

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBackToDashboard = () => {
    if (location.pathname !== '/admin') {
      navigate('/admin');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            
            {location.pathname !== '/admin' && (
              <>
                <span className="text-gray-400">/</span>
                <Button
                  onClick={handleBackToDashboard}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              </>
            )}
          </div>

          {schoolName && (
            <div className="text-right">
              <h2 className="text-sm font-medium text-gray-900">{schoolName}</h2>
              <p className="text-xs text-gray-500">Administration Panel</p>
            </div>
          )}
        </div>

        {/* Section Navigation */}
        {currentSection && onSectionChange && (
          <div className="flex items-center space-x-1 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              
              return (
                <Button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={`flex items-center space-x-2 whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavigation;