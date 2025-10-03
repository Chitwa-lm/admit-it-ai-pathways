import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { ApplicationProgress as ProgressType } from "@/hooks/useApplicationDraft";

interface ApplicationProgressProps {
  progress: ProgressType;
  isSaving?: boolean;
}

const ApplicationProgress = ({ progress, isSaving }: ApplicationProgressProps) => {
  const sections = [
    {
      title: "Student Information",
      completed: progress.studentInfo,
      description: "Name, date of birth, grade level"
    },
    {
      title: "Parent Information", 
      completed: progress.parentInfo,
      description: "Contact details and address"
    },
    {
      title: "Additional Information",
      completed: progress.additionalInfo,
      description: "Emergency contacts and special needs"
    }
  ];

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle2 className="h-5 w-5 text-green-500" />
    ) : (
      <Circle className="h-5 w-5 text-muted-foreground" />
    );
  };

  const getStatusBadge = (completed: boolean) => {
    return completed ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        Complete
      </Badge>
    ) : (
      <Badge variant="secondary">
        Pending
      </Badge>
    );
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Application Progress</h3>
            <p className="text-sm text-muted-foreground">
              {progress.completionPercentage}% completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSaving && (
              <>
                <AlertCircle className="h-4 w-4 text-blue-500 animate-pulse" />
                <span className="text-sm text-blue-600">Saving...</span>
              </>
            )}
            <Badge 
              variant={progress.completionPercentage === 100 ? "default" : "secondary"}
              className={progress.completionPercentage === 100 ? "bg-green-100 text-green-800 border-green-200" : ""}
            >
              {progress.completionPercentage}%
            </Badge>
          </div>
        </div>

        <Progress value={progress.completionPercentage} className="mb-4" />

        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                {getStatusIcon(section.completed)}
                <div>
                  <p className="font-medium text-sm">{section.title}</p>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
              </div>
              {getStatusBadge(section.completed)}
            </div>
          ))}
        </div>

        {progress.completionPercentage > 0 && progress.completionPercentage < 100 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                Your progress is automatically saved. You can continue where you left off anytime.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationProgress;