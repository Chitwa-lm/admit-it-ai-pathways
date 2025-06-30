
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, School, Bell } from 'lucide-react';

interface AdminHeaderProps {
  schoolName: string;
  adminName: string;
  onSignOut: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  schoolName, 
  adminName, 
  onSignOut 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center">
            <School className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {schoolName} Admin
            </h1>
            <p className="text-sm text-gray-500">School Administration Portal</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Button>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{adminName}</p>
            <p className="text-xs text-gray-500">School Administrator</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
