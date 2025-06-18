
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Users, Target } from "lucide-react";

const NLPAnalysis = () => {
  const analysisData = [
    {
      category: "Academic Excellence",
      score: 85,
      color: "bg-blue-500",
      icon: Target
    },
    {
      category: "Communication Skills",
      score: 78,
      color: "bg-green-500",
      icon: Users
    },
    {
      category: "Leadership Potential",
      score: 72,
      color: "bg-purple-500",
      icon: TrendingUp
    },
    {
      category: "Technical Aptitude",
      score: 90,
      color: "bg-orange-500",
      icon: Brain
    }
  ];

  return (
    <Card className="animate-slide-in-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>NLP Analysis Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {analysisData.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">{item.category}</span>
                  </div>
                  <span className="text-sm font-bold">{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-2" />
              </div>
            );
          })}
          <div className="pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">81.25%</div>
              <div className="text-sm text-gray-600">Overall Analysis Score</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NLPAnalysis;
