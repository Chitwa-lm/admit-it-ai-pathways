
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserPlus, LogIn, FileText, Upload, CheckCircle, Search, Clock, AlertCircle, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvailablePlaces from "@/components/AvailablePlaces";
import { ChatbotButton } from "../components/chatbot/ChatbotButton";
import { VoiceGuide } from "../components/VoiceGuide";
import { usePendingApplications } from "@/hooks/usePendingApplications";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import ParentNavigation from "@/components/parent/ParentNavigation";

const ParentPortal = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const {
    pendingApplications,
    handleContinueApplication,
    checkPendingApplications,
  } = usePendingApplications();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // This is handled by the ParentLogin page now
    // Redirect users to the proper login page
    window.location.href = '/parent-login';
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <ParentNavigation userName={getUserDisplayName()} showQuickActions={false} />
        <div className="bg-card border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Parent Portal</h1>
                <p className="text-muted-foreground mt-2">Welcome back, {getUserDisplayName()}! Manage your child's admission application.</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={getUserDisplayName()} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-foreground">{getUserDisplayName()}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-6 border-b border-border">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "dashboard"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("search")}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "search"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
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
              {/* Pending Applications Alert */}
              {pendingApplications.length > 0 && (
                <Card className="mb-6 border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-orange-800">
                      <AlertCircle className="h-5 w-5" />
                      <span>Pending Applications</span>
                      <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                        {pendingApplications.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700 mb-4">
                      You have {pendingApplications.length} incomplete application{pendingApplications.length > 1 ? 's' : ''} that you can continue working on.
                    </p>
                    <div className="space-y-3">
                      {pendingApplications.slice(0, 2).map((application) => {
                        const statusInfo = APPLICATION_STATUSES.find(s => s.value === application.status);
                        return (
                          <div key={application.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                  Application #{application.id.slice(-8)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {application.grade_level.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 flex items-center space-x-4 mt-1">
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Updated: {format(new Date(application.updated_at), 'MMM dd')}</span>
                                </span>
                                <Badge variant="secondary" className={`bg-${statusInfo?.color}-100 text-${statusInfo?.color}-800`}>
                                  {statusInfo?.label}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleContinueApplication(application.id)}
                              className="ml-4"
                            >
                              Continue
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                    {pendingApplications.length > 2 && (
                      <div className="mt-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={checkPendingApplications}
                          className="text-orange-700 border-orange-300 hover:bg-orange-100"
                        >
                          View All Pending Applications
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>Start Application</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Begin your child's enrollment application. When you start an application without searching for specific places, it will automatically be sent to all applicable schools based on your preferences.
                    </p>
                    <Link to="/application">
                      <Button className="w-full">Start Application</Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="h-5 w-5 text-primary" />
                      <span>Upload Documents</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Upload required documents including birth certificate, immunization records, and transcripts.
                    </p>
                    <Link to="/documents">
                      <Button variant="outline" className="w-full">Upload Documents</Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Application Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
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
                        <span className="text-sm text-muted-foreground font-medium">Waiting</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="h-5 w-5 text-primary" />
                      <span>Find School Places</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Search for available places in schools across different grades and districts before applying.
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

        {/* Voice-Enabled Chatbot */}
        <ChatbotButton 
          context="general" 
          position="bottom-right"
          showVoiceIndicator={true}
        />
        
        {/* Voice Guide */}
        <VoiceGuide />
      </div>
    );
  }

  // If not logged in, redirect to login page
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Access Required</CardTitle>
          <p className="text-muted-foreground">
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
