import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  className = '',
}) => {
  const location = useLocation();

  // Auto-generate breadcrumbs if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        icon: <Home className="h-4 w-4" />,
      });
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Generate human-readable labels
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Custom labels for specific routes
      switch (segment) {
        case 'parent-portal':
          label = 'Parent Portal';
          break;
        case 'parent-login':
          label = 'Parent Login';
          break;
        case 'admin-login':
          label = 'Admin Login';
          break;
        case 'test-database':
          label = 'Database Test';
          break;
        case 'application':
          label = 'Application Form';
          break;
        case 'documents':
          label = 'Document Upload';
          break;
        case 'admin':
          label = 'Admin Dashboard';
          break;
        case 'dashboard':
          label = 'Dashboard';
          break;
      }

      breadcrumbs.push({
        label,
        href: index === pathSegments.length - 1 ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          )}
          
          {item.href ? (
            <Link
              to={item.href}
              className="flex items-center space-x-1 hover:text-foreground transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="flex items-center space-x-1 text-foreground font-medium">
              {item.icon}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;