
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Application } from '@/types/database';
import { format } from 'date-fns';
import { User, Calendar, School, FileText, Star } from 'lucide-react';

interface ApplicationDetailsModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  application,
  isOpen,
  onClose,
}) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>
              Application Details - {application.students?.first_name} {application.students?.last_name}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Student Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">
                    {application.students?.first_name} {application.students?.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Grade</label>
                  <p className="text-gray-900">{application.students?.grade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">
                    {application.students?.date_of_birth ? 
                      format(new Date(application.students.date_of_birth), 'MMM dd, yyyy') : 
                      'N/A'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Current School</label>
                  <p className="text-gray-900">
                    {application.students?.current_school || 'No previous school'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Application Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Application Status</label>
                  <div className="mt-1">
                    {getStatusBadge(application.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted Date</label>
                  <p className="text-gray-900">
                    {application.submitted_date ? 
                      format(new Date(application.submitted_date), 'MMM dd, yyyy HH:mm') : 
                      'N/A'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Academic Year</label>
                  <p className="text-gray-900">
                    {application.available_places?.academic_year || '2024-2025'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Application Deadline</label>
                  <p className="text-gray-900">
                    {application.available_places?.application_deadline ? 
                      format(new Date(application.available_places.application_deadline), 'MMM dd, yyyy') : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scoring Information */}
          {(application.overall_score || application.academic_readiness_score) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Assessment Scores</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {application.academic_readiness_score && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Academic Readiness</label>
                      <p className="text-2xl font-bold text-blue-600">
                        {application.academic_readiness_score}/100
                      </p>
                    </div>
                  )}
                  {application.social_skills_score && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Social Skills</label>
                      <p className="text-2xl font-bold text-green-600">
                        {application.social_skills_score}/100
                      </p>
                    </div>
                  )}
                  {application.parent_engagement_score && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Parent Engagement</label>
                      <p className="text-2xl font-bold text-purple-600">
                        {application.parent_engagement_score}/100
                      </p>
                    </div>
                  )}
                  {application.learning_potential_score && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Learning Potential</label>
                      <p className="text-2xl font-bold text-orange-600">
                        {application.learning_potential_score}/100
                      </p>
                    </div>
                  )}
                </div>
                {application.overall_score && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Overall Score</label>
                      <p className="text-3xl font-bold text-gray-900">
                        {application.overall_score}/100
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {(application.parent_notes || application.admin_notes) && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.parent_notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Parent Notes</label>
                    <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded">
                      {application.parent_notes}
                    </p>
                  </div>
                )}
                {application.admin_notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Admin Notes</label>
                    <p className="text-gray-900 mt-1 p-3 bg-blue-50 rounded">
                      {application.admin_notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsModal;
