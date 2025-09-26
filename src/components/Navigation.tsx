
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GraduationCap, Search, FileText, Settings, Menu, Database, ChevronDown, Users, Shield, LogOut, User } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { navigationUtils } from '@/lib/utils/navigation';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isAdmin = () => navigationUtils.isAdmin(user);
  const getPortalLink = () => navigationUtils.getPortalRoute(user);
  const getPortalLabel = () => navigationUtils.getPortalLabel(user);

  return (
    <nav className="bg-blue-50 shadow-md border-b border-blue-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-800">
                Zambian Admissions
              </h1>
              <p className="text-xs text-blue-700 font-medium">Education Management System</p>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/dashboard"
            className={`flex items-center space-x-1 font-medium ${isActive('/dashboard') ? 'text-blue-600' : 'text-blue-800 hover:text-blue-600'
              }`}
          >
            <Search className="h-4 w-4" />
            <span>Find Schools</span>
          </Link>
          <Link
            to="/application"
            className={`flex items-center space-x-1 font-medium ${isActive('/application') ? 'text-blue-600' : 'text-blue-800 hover:text-blue-600'
              }`}
          >
            <FileText className="h-4 w-4" />
            <span>Apply</span>
          </Link>
          <Link
            to={getPortalLink()}
            className={`flex items-center space-x-1 font-medium ${isActive(getPortalLink()) ? 'text-blue-600' : 'text-blue-800 hover:text-blue-600'
              }`}
          >
            <Settings className="h-4 w-4" />
            <span>Portal</span>
          </Link>
          <Link
            to="/test-database"
            className={`flex items-center space-x-1 font-medium ${isActive('/test-database') ? 'text-blue-600' : 'text-blue-800 hover:text-blue-600'
              }`}
          >
            <Database className="h-4 w-4" />
            <span>Test DB</span>
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={getUserDisplayName()} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-blue-800">{getUserDisplayName()}</div>
                    <div className="text-xs text-blue-600">{user.email}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-blue-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <div className="text-sm font-medium">{getUserDisplayName()}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={getPortalLink()} className="flex items-center space-x-2 w-full">
                    <User className="h-4 w-4" />
                    <span>{getPortalLabel()}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/application" className="flex items-center space-x-2 w-full">
                    <FileText className="h-4 w-4" />
                    <span>My Applications</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center space-x-2 text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Login
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/parent-login" className="flex items-center space-x-2 w-full">
                    <Users className="h-4 w-4" />
                    <span>Parent/Student Login</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin-login" className="flex items-center space-x-2 w-full">
                    <Shield className="h-4 w-4" />
                    <span>Admin Login</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5 text-blue-800" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-blue-50">
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-blue-800 hover:text-blue-600 font-medium py-2 border-b border-blue-200"
                >
                  <Search className="h-4 w-4" />
                  <span>Find Schools</span>
                </Link>
                <Link
                  to="/application"
                  className="flex items-center space-x-2 text-blue-800 hover:text-blue-600 font-medium py-2 border-b border-blue-200"
                >
                  <FileText className="h-4 w-4" />
                  <span>Apply</span>
                </Link>
                <Link
                  to={getPortalLink()}
                  className="flex items-center space-x-2 text-blue-800 hover:text-blue-600 font-medium py-2 border-b border-blue-200"
                >
                  <Settings className="h-4 w-4" />
                  <span>Portal</span>
                </Link>
                <Link
                  to="/test-database"
                  className="flex items-center space-x-2 text-blue-800 hover:text-blue-600 font-medium py-2 border-b border-blue-200"
                >
                  <Database className="h-4 w-4" />
                  <span>Test Database</span>
                </Link>
                {user ? (
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-100 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={getUserDisplayName()} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-blue-800">{getUserDisplayName()}</div>
                        <div className="text-xs text-blue-600">{user.email}</div>
                      </div>
                    </div>
                    <Link
                      to={getPortalLink()}
                      className="flex items-center space-x-2 text-blue-800 hover:text-blue-600 font-medium py-2 border-b border-blue-200"
                    >
                      <User className="h-4 w-4" />
                      <span>{getPortalLabel()}</span>
                    </Link>
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      size="default"
                      className="border-red-300 text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 mt-4">
                    <Button
                      variant="default"
                      size="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      asChild
                    >
                      <Link to="/parent-login" className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Parent/Student Login</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full"
                      asChild
                    >
                      <Link to="/admin-login" className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Admin Login</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
