
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, Users, AlertCircle } from 'lucide-react';
import type { Application } from '@/types/database';

interface AdminStatsProps {
  applications: Application[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ applications }) => {
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    underReview: applications.filter(app => app.status === 'under_review').length,
    enrolled: applications.filter(app => app.status === 'enrolled').length,
    waitlisted: applications.filter(app => app.status === 'waitlisted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'Pending Review',
      value: stats.pending + stats.underReview,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Enrolled',
      value: stats.enrolled,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Waitlisted',
      value: stats.waitlisted,
      icon: AlertCircle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="flex items-center p-6">
            <div className={`${stat.color} text-white p-3 rounded-lg mr-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm ${stat.textColor} font-medium`}>
                {stat.title}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
