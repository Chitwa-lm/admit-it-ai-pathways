import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { FormProgress } from '@/hooks/useApplicationDraft';

interface ApplicationProgressProps {
  progress: FormProgress;
  progressPercentage: number;
  completedSteps: number;
  totalSteps: number;
  lastSaved?: string;
  isSaving: boolean;
}

const ApplicationProgress: React.FC<ApplicationProgressProps> = ({
  progress,
  progressPercentage,
  completedSteps,
  totalSteps,
  lastSaved,
  isSaving
}) => {
  const steps = [
    {
      name: 'Student Information',
      completed: progress.studentInfo,
      description: 'Name, date of birth, and grade level'
    },
    {
      name: 'Parent Information',
      completed: progress.parentInfo,
      description: 'Contact details and address'
    },
    {
      name: 'Additional Information',
      completed: progress.additionalInfo,
      description: 'Emergency contacts and special needs'
    }
  ];

  const formatLastSaved = (timestamp?: string) => {
    if (!timestamp) return 'Not saved';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Application Progress</CardTitle>
          <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
            {completedSteps}/{totalSteps} Steps
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step-by-step Progress */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Steps Completed:</h4>
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              {step.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  step.completed ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {step.completed && (
                <Badge variant="secondary" className="text-xs">
                  Complete
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Save Status */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>
                {isSaving ? 'Saving...' : `Last saved: ${formatLastSaved(lastSaved)}`}
              </span>
            </div>
            {progressPercentage === 100 && (
              <Badge variant="default" className="text-xs">
                Ready to Submit
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationProgress;