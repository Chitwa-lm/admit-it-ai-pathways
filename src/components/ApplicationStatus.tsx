
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, AlertCircle, FileText, XCircle } from "lucide-react";
import { useApplications } from "@/hooks/useApplications";
import { format } from "date-fns";

const ApplicationStatus = () => {
  const { data: applications = [], isLoading, error } = useApplications();

  if (isLoading) {
    return (
      <Card className="animate-slide-in-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Recent Applications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading applications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="animate-slide-in-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Recent Applications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading applications: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "enrolled":
        return <Check className="h-4 w-4" />;
      case "under_review":
        return <Clock className="h-4 w-4" />;
      case "waitlisted":
        return <AlertCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "enrolled":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "under_review":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "waitlisted":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "under_review":
        return "Under Review";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Show recent applications (limit to 10)
  const recentApplications = applications.slice(0, 10);

  return (
    <Card className="animate-slide-in-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Recent Applications</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentApplications.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">
              Applications will appear here once parents start submitting them.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium text-gray-900">
                      {app.students?.first_name} {app.students?.last_name}
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(app.status)} transition-colors`}
                    >
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(app.status)}
                        <span>{getStatusDisplay(app.status)}</span>
                      </span>
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {app.students?.grade} • {app.schools?.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Applied {format(new Date(app.submitted_date), 'MMM dd, yyyy')}
                  </div>
                  {app.overall_score && (
                    <div className="text-sm text-primary font-medium mt-1">
                      Overall Score: {app.overall_score}/10
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationStatus;
