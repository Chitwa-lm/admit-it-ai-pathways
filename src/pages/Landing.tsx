
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  Star, 
  ArrowRight,
  School,
  Shield,
  Zap,
  BookOpen,
  GraduationCap,
  Clipboard,
  Award,
  Target,
  TrendingUp
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative">
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200/50">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Trusted by 500+ Schools</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                Smart School
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                  Admissions
                </span>
              </h1>
              <p className="text-xl text-slate-700 leading-relaxed max-w-2xl">
                Revolutionize your K-12 enrollment process with AI-powered insights, 
                streamlined workflows, and transparent parent communication.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/parent-login">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-10 py-7 shadow-2xl rounded-2xl font-semibold">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-7 border-2 hover:bg-slate-50 rounded-2xl font-semibold">
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-12 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-slate-600 font-medium">Schools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">50K+</div>
                <div className="text-sm text-slate-600 font-medium">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">98%</div>
                <div className="text-sm text-slate-600 font-medium">Satisfaction</div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-slide-in-up">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&h=500&fit=crop&crop=center"
                alt="Students collaborating in modern classroom"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Success Card */}
            <Card className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-lg shadow-2xl border-0 max-w-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Application Approved!</p>
                    <p className="text-sm text-slate-600">Welcome to Lincoln Elementary</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Stats Card */}
            <Card className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-lg shadow-2xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">95% Faster</p>
                    <p className="text-xs text-slate-600">Processing Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Core Features</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900">
              Everything Your School Needs
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools designed specifically for modern K-12 admissions and enrollment management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-gradient-to-br from-white to-slate-50/50">
              <CardContent className="p-10 text-center space-y-6">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <GraduationCap className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">AI-Powered Processing</h3>
                <p className="text-slate-600 leading-relaxed">Advanced algorithms analyze applications and provide intelligent recommendations for faster, more accurate enrollment decisions</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-gradient-to-br from-white to-slate-50/50">
              <CardContent className="p-10 text-center space-y-6">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Bank-Level Security</h3>
                <p className="text-slate-600 leading-relaxed">Military-grade encryption and compliance protocols ensure your sensitive data and student information remain completely protected</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-gradient-to-br from-white to-slate-50/50">
              <CardContent className="p-10 text-center space-y-6">
                <div className="bg-gradient-to-br from-purple-100 to-violet-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Real-time Collaboration</h3>
                <p className="text-slate-600 leading-relaxed">Instant notifications and seamless communication keep parents, students, and administrators perfectly synchronized throughout the process</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"></div>
        <div className="max-w-5xl mx-auto text-center space-y-10 relative">
          <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
              School&apos;s Future?
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of forward-thinking schools already using AdmitAI Pro to create exceptional 
            enrollment experiences for families and staff.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
            <Link to="/parent-login">
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-2xl rounded-2xl">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 text-white border-2 border-white/30 hover:bg-white/10 font-semibold rounded-2xl backdrop-blur-sm">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl">
                <School className="h-7 w-7" />
              </div>
              <div className="text-left">
                <h3 className="text-3xl font-bold">AdmitAI Pro</h3>
                <p className="text-slate-400">Smart K-12 Enrollment Platform</p>
              </div>
            </div>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              © 2024 AdmitAI Pro. All rights reserved. Empowering schools and families 
              through intelligent enrollment technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
