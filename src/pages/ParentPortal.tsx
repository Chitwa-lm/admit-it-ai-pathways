
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, LogIn, FileText, Upload, CheckCircle, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AvailablePlaces from "@/components/AvailablePlaces";

const ParentPortal = () => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // This is handled by the ParentLogin page now
    // Redirect users to the proper login page
    window.location.href = '/parent-login';
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Parent Portal</h1>
              <p className="text-gray-600 mt-2">Welcome back! Manage your child's admission application.</p>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-6 border-b">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "dashboard"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("search")}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "search"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Available Places
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          {activeTab === "dashboard" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>Start Application</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Begin your child's enrollment application for the upcoming academic year.
                    </p>
                    <Link to="/application">
                      <Button className="w-full">Start Application</Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="h-5 w-5 text-primary" />
                      <span>Upload Documents</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Upload required documents including birth certificate, immunization records, and transcripts.
                    </p>
                    <Link to="/documents">
                      <Button variant="outline" className="w-full">Upload Documents</Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Application Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Track the progress of your application and view any updates or requirements.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Application Form</span>
                        <span className="text-sm text-green-600 font-medium">Complete</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Documents</span>
                        <span className="text-sm text-yellow-600 font-medium">Pending</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Review</span>
                        <span className="text-sm text-gray-400 font-medium">Waiting</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="h-5 w-5 text-primary" />
                      <span>Find School Places</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Search for available places in schools across different grades and districts.
                    </p>
                    <Button 
                      onClick={() => setActiveTab("search")}
                      variant="outline" 
                      className="w-full"
                    >
                      Search Available Places
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "search" && (
            <AvailablePlaces />
          )}
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Access Required</CardTitle>
          <p className="text-gray-600">
            Please log in to access the parent portal
          </p>
        </CardHeader>
        <CardContent>
          <Link to="/parent-login">
            <Button className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              Go to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentPortal;
