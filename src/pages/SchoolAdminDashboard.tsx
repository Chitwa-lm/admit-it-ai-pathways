
import React from 'react';
import { useSchoolAdmin, useSchoolApplications } from '@/hooks/useSchoolAdmin';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { School, Users, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import ApplicationsTable from '@/components/admin/ApplicationsTable';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';

const SchoolAdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { data: adminData, isLoading: adminLoading } = useSchoolAdmin();
  const { data: applications, isLoading: applicationsLoading } = useSchoolApplications();

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

  if (!adminData) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        schoolName={adminData.schools?.name || 'School'} 
        adminName={user?.email || 'Admin'}
        onSignOut={signOut}
      />
      
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {adminData.schools?.name} - Admin Dashboard
            </h1>
            <p className="text-gray-600">
              {adminData.schools?.school_type} School • {adminData.schools?.town}, {adminData.schools?.province}
            </p>
          </div>
        </div>

        <AdminStats applications={applications || []} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Recent Applications
            </CardTitle>
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
