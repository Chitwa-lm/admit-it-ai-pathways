
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, Users, AlertCircle, TrendingUp } from 'lucide-react';
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
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-50 to-indigo-50',
    },
    {
      title: 'Pending Review',
      value: stats.pending + stats.underReview,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      bg: 'from-amber-50 to-orange-50',
    },
    {
      title: 'Enrolled Students',
      value: stats.enrolled,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      bg: 'from-green-50 to-emerald-50',
    },
    {
      title: 'Waitlisted',
      value: stats.waitlisted,
      icon: AlertCircle,
      gradient: 'from-purple-500 to-pink-600',
      bg: 'from-purple-50 to-pink-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
          <CardContent className={`p-8 bg-gradient-to-br ${stat.bg} relative overflow-hidden`}>
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.title}</p>
                <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
