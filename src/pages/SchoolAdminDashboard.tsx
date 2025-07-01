
import React, { useEffect } from 'react';
import { useSchoolAdmin, useSchoolApplications } from '@/hooks/useSchoolAdmin';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { School, Users, FileText, Clock, CheckCircle, XCircle, Crown, Database } from 'lucide-react';
import ApplicationsTable from '@/components/admin/ApplicationsTable';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import { createSampleData } from '@/utils/sampleData';

const SchoolAdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { data: adminData, isLoading: adminLoading } = useSchoolAdmin();
  const { data: applications, isLoading: applicationsLoading, refetch } = useSchoolApplications();

  // Check if this is the super admin
  const isSuperAdmin = user?.email === 'chitwamakupe15@gmail.com';
  const isMockAdmin = user && user.email; // Any logged-in user can be admin in development

  // Function to create sample data for testing
  const handleCreateSampleData = async () => {
    await createSampleData();
    // Refetch applications after creating sample data
    refetch();
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-gray-600 mb-4">
              You need to be signed in to access the admin dashboard.
            </p>
            <Button onClick={() => window.location.href = '/admin-login'}>
              Admin Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!adminData && !isMockAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have school administrator privileges.
            </p>
            <Button onClick={() => signOut()} variant="outline">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mockSchoolData = {
    name: isSuperAdmin ? 'Super Admin Dashboard - All Zambian Schools' : 'Demo Elementary School',
    school_type: isSuperAdmin ? 'Super Admin' : 'Elementary',
    town: isSuperAdmin ? 'All Provinces' : 'Demo City',
    province: 'Zambia'
  };

  const schoolData = adminData?.schools || mockSchoolData;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        schoolName={schoolData.name} 
        adminName={isSuperAdmin ? 'Super Administrator' : user?.email || 'Admin'}
        onSignOut={signOut}
      />
      
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isSuperAdmin && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl">
                <Crown className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                {schoolData.name}
                {isSuperAdmin && (
                  <Badge className="ml-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    Super Admin
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600">
                {isSuperAdmin ? 
                  'Complete oversight of all school applications across Zambia' :
                  `${schoolData.school_type} School • ${schoolData.town}, ${schoolData.province}`
                }
              </p>
            </div>
          </div>
          
          {/* Add sample data button for testing */}
          {isSuperAdmin && (
            <Button 
              onClick={handleCreateSampleData}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Database className="h-4 w-4" />
              <span>Create Sample Data</span>
            </Button>
          )}
        </div>

        <AdminStats applications={applications || []} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              {isSuperAdmin ? 'All School Applications' : 'Recent Applications'}
            </CardTitle>
            {isSuperAdmin && (
              <p className="text-sm text-gray-600">
                Viewing applications from all schools across Zambia
              </p>
            )}
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading applications...</p>
              </div>
            ) : (
              <ApplicationsTable applications={applications || []} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SchoolAdminDashboard;
