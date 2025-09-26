import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, School, Calendar, AlertTriangle } from 'lucide-react';
import { Application } from '@/types/database';
import { APPLICATION_STATUSES } from '@/lib/constants';
import { format } from 'date-fns';

interface PendingApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pendingApplications: Application[];
  onContinueApplication: (applicationId: string) => void;
  onStartNewApplication: () => void;
  onDiscardApplication: (applicationId: string) => void;
}

const PendingApplicationDialog: React.FC<PendingApplicationDialogProps> = ({
  isOpen,
  onClose,
  pendingApplications,
  onContinueApplication,
  onStartNewApplication,
  onDiscardApplication,
}) => {
  const [selectedApplication, setSelectedApplication] = React.useState<Application | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = React.useState(false);

  const getStatusInfo = (status: string) => {
    const statusConfig = APPLICATION_STATUSES.find(s => s.value === status);
    return statusConfig || { label: status, color: 'gray' };
  };

  const handleDiscardClick = (application: Application) => {
    setSelectedApplication(application);
    setShowDiscardConfirm(true);
  };

  const handleConfirmDiscard = () => {
    if (selectedApplication) {
      onDiscardApplication(selectedApplication.id);
      setShowDiscardConfirm(false);
      setSelectedApplication(null);
    }
  };

  const calculateProgress = (applicationData: any) => {
    const sections = [
      'personal_info',
      'academic_history',
      'essays',
      'emergency_contact'
    ];
    
    const completed = sections.filter(section => 
      applicationData[section] && 
      (Array.isArray(applicationData[section]) ? applicationData[section].length > 0 : true)
    ).length;
    
    return Math.round((completed / sections.length) * 100);
  };

  return (
    <>
      <AlertDialog open={isOpen && !showDiscardConfirm} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Pending Applications Found</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have {pendingApplications.length} pending application{pendingApplications.length > 1 ? 's' : ''}. 
              You can continue where you left off or start a new application.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {pendingApplications.map((application) => {
              const statusInfo = getStatusInfo(application.status);
              const progress = calculateProgress(application.application_data);
              
              return (
                <Card key={application.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <School className="h-4 w-4 text-blue-600" />
                          <span>Application #{application.id.slice(-8)}</span>
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Started: {format(new Date(application.created_at), 'MMM dd, yyyy')}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Last updated: {format(new Date(application.updated_at), 'MMM dd, yyyy')}</span>
                          </span>
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}
                      >
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Application Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Grade Level:</span>
                        <span className="ml-2">{application.grade_level.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Progress:</span>
                        <span className="ml-2">{progress}% complete</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Application Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Personal Info Preview */}
                    {application.application_data.personal_info && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Applicant Information</h4>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">
                            {application.application_data.personal_info.first_name} {application.application_data.personal_info.last_name}
                          </span>
                          {application.application_data.personal_info.province && (
                            <span className="ml-2">• {application.application_data.personal_info.province}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-2">
                      <Button
                        onClick={() => onContinueApplication(application.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Continue Application
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDiscardClick(application)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Discard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Discarded applications cannot be recovered. 
                Make sure you want to permanently delete the application before proceeding.
              </p>
            </div>
            <div className="flex space-x-2">
              <AlertDialogCancel onClick={onClose}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onStartNewApplication}
                className="bg-green-600 hover:bg-green-700"
              >
                Start New Application
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Confirm Discard Application</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this application? This action cannot be undone.
              {selectedApplication && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm">
                    <strong>Application:</strong> #{selectedApplication.id.slice(-8)}<br />
                    <strong>Grade Level:</strong> {selectedApplication.grade_level.replace('_', ' ').toUpperCase()}<br />
                    <strong>Progress:</strong> {calculateProgress(selectedApplication.application_data)}% complete
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDiscardConfirm(false)}>
              Keep Application
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDiscard}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Discard Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PendingApplicationDialog;