
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import ApplicationStatus from "@/components/ApplicationStatus";
import NLPAnalysis from "@/components/NLPAnalysis";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, FileText, Check, Clock, ExternalLink, MapPin } from "lucide-react";
import { useStats } from "@/hooks/useStats";

const Index = () => {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="animate-fade-in flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to K-12 Admissions Dashboard
            </h2>
            <p className="text-gray-600">
              Manage student enrollment applications with intelligent analysis and real-time tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>Landing Page</span>
              </Button>
            </Link>
            <Link to="/parent-portal">
              <Button className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>Parent Portal</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="New Applications"
            value={isLoading ? "..." : stats?.newApplications.toString() || "0"}
            change="+8%"
            icon={FileText}
            color="bg-blue-500"
          />
          <StatsCard
            title="Under Review"
            value={isLoading ? "..." : stats?.underReview.toString() || "0"}
            change="+3%"
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Enrolled"
            value={isLoading ? "..." : stats?.enrolled.toString() || "0"}
            change="+12%"
            icon={Check}
            color="bg-green-500"
          />
          <StatsCard
            title="Available Spots"
            value={isLoading ? "..." : stats?.totalAvailableSpots.toString() || "0"}
            change="+5%"
            icon={MapPin}
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
