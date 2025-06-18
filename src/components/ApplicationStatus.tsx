
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, AlertCircle, FileText } from "lucide-react";

interface Application {
  id: string;
  studentName: string;
  grade: string;
  status: "pending" | "under-review" | "enrolled" | "waitlisted";
  submittedDate: string;
  nlpScore?: number;
}

const ApplicationStatus = () => {
  const applications: Application[] = [
    {
      id: "APP001",
      studentName: "Emma Johnson",
      grade: "Grade 9",
      status: "enrolled",
      submittedDate: "2024-01-15",
      nlpScore: 8.5
    },
    {
      id: "APP002",
      studentName: "Michael Chen",
      grade: "Grade 6",
      status: "under-review",
      submittedDate: "2024-01-14",
      nlpScore: 7.2
    },
    {
      id: "APP003",
      studentName: "Sarah Wilson",
      grade: "Kindergarten",
      status: "pending",
      submittedDate: "2024-01-13",
      nlpScore: 6.8
    },
    {
      id: "APP004",
      studentName: "David Rodriguez",
      grade: "Grade 3",
      status: "waitlisted",
      submittedDate: "2024-01-12",
      nlpScore: 5.8
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "enrolled":
        return <Check className="h-4 w-4" />;
      case "under-review":
        return <Clock className="h-4 w-4" />;
      case "waitlisted":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "enrolled":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "under-review":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "waitlisted":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Card className="animate-slide-in-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Recent Applications</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="font-medium text-gray-900">{app.studentName}</div>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(app.status)} transition-colors`}
                  >
                    <span className="flex items-center space-x-1">
                      {getStatusIcon(app.status)}
                      <span className="capitalize">{app.status.replace('-', ' ')}</span>
                    </span>
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {app.grade} • Applied {app.submittedDate}
                </div>
                {app.nlpScore && (
                  <div className="text-sm text-primary font-medium mt-1">
                    Assessment Score: {app.nlpScore}/10
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatus;
