
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: string;
}

const StatsCard = ({ title, value, change, icon: Icon, color = "bg-blue-600" }: StatsCardProps) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50/50">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</p>
            <div className="flex items-baseline space-x-3">
              <p className="text-4xl font-bold text-slate-900">{value}</p>
              {change && (
                <span className="text-sm bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent font-bold">
                  {change}
                </span>
              )}
            </div>
          </div>
          <div className={`${color} p-4 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
