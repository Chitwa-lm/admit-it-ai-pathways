
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { School, LogOut, Home, Users, FileText, Settings } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-lg shadow-xl border-b border-border px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                <School className="h-5 w-5" />
              </div>
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-red-400 w-3 h-3 rounded-full shadow-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                AdmitAI Pro
              </h1>
              <p className="text-xs text-muted-foreground font-medium">K-12 Enrollment Platform</p>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button 
                  variant={isActive('/dashboard') ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              
              <Link to="/parent-portal">
                <Button 
                  variant={isActive('/parent-portal') ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Portal</span>
                </Button>
              </Link>
              
              <Link to="/application">
                <Button 
                  variant={isActive('/application') ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Application</span>
                </Button>
              </Link>
              
              <Link to="/admin">
                <Button 
                  variant={isActive('/admin') ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              </Link>
              
              <ThemeToggle />
              
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2 border-2 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/parent-login">
                <Button variant="outline" size="sm" className="font-medium border-2">
                  Parent Login
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium">
                  Admin
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
