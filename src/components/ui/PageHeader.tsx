import React from 'react';
import BackButton from './BackButton';
import Breadcrumb from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string; icon?: React.ReactNode }>;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  showBackButton = true,
  backTo,
  backLabel,
  showBreadcrumb = true,
  breadcrumbItems,
  actions,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Breadcrumb */}
      {showBreadcrumb && (
        <Breadcrumb items={breadcrumbItems} />
      )}

      {/* Header Content */}
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          {/* Back Button */}
          {showBackButton && (
            <BackButton
              to={backTo}
              label={backLabel}
              variant="ghost"
              size="sm"
            />
          )}

          {/* Title and Description */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground mt-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;