
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import ApplicationStatus from "@/components/ApplicationStatus";
import NLPAnalysis from "@/components/NLPAnalysis";
import { Users, FileText, Check, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to AdmitAI Dashboard
          </h2>
          <p className="text-gray-600">
            Manage student admissions with intelligent analysis and real-time tracking
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Applications"
            value="1,247"
            change="+12%"
            icon={FileText}
            color="bg-blue-500"
          />
          <StatsCard
            title="Under Review"
            value="342"
            change="+5%"
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Approved"
            value="678"
            change="+18%"
            icon={Check}
            color="bg-green-500"
          />
          <StatsCard
            title="Active Students"
            value="892"
            change="+8%"
            icon={Users}
            color="bg-purple-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ApplicationStatus />
          </div>
          <div>
            <NLPAnalysis />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
