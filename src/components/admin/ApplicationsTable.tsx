
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Edit, FileText, School } from 'lucide-react';
import type { Application } from '@/types/database';
import { format } from 'date-fns';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import { useAuth } from '@/hooks/useAuth';

interface ApplicationsTableProps {
  applications: Application[];
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({ applications }) => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { user } = useAuth();
  const isSuperAdmin = user?.email === 'chitwamakupe15@gmail.com';

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      under_review: { variant: 'default' as const, label: 'Under Review' },
      enrolled: { variant: 'default' as const, label: 'Enrolled' },
      waitlisted: { variant: 'outline' as const, label: 'Waitlisted' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
        <p className="text-gray-500">
          {isSuperAdmin ? 
            'No applications have been submitted to any schools yet.' :
            'Applications for your school will appear here once parents start applying.'
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
              {isSuperAdmin && (
                <th className="text-left py-3 px-4 font-medium text-gray-900">School</th>
              )}
              <th className="text-left py-3 px-4 font-medium text-gray-900">Grade</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Applied Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
              <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {application.students?.first_name} {application.students?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {application.students?.current_school || 'No previous school'}
                    </p>
                  </div>
                </td>
                {isSuperAdmin && (
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <School className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {application.schools?.name || 'Unknown School'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {application.schools?.town}, {application.schools?.province}
                        </p>
                      </div>
                    </div>
                  </td>
                )}
                <td className="py-3 px-4 text-sm text-gray-900">
                  {application.students?.grade}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {application.submitted_date ? 
                    format(new Date(application.submitted_date), 'MMM dd, yyyy') : 
                    'N/A'
                  }
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(application.status)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {application.overall_score ? 
                    `${application.overall_score}/100` : 
                    'Not scored'
                  }
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </>
  );
};

export default ApplicationsTable;
