
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
  TrendingUp,
  Sparkles,
  Play
} from "lucide-react";
import AboutSection from "@/components/AboutSection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/3 via-indigo-600/3 to-purple-600/3"></div>
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative">
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-slate-800">Trusted by 500+ Schools Worldwide</span>
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </div>
              
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 leading-[0.9] tracking-tight">
                Smart School
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                  Admissions
                </span>
                <span className="text-3xl lg:text-4xl xl:text-5xl text-slate-600 font-medium block mt-4">
                  Powered by AI
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-slate-700 leading-relaxed max-w-2xl font-light">
                Transform your K-12 enrollment process with cutting-edge artificial intelligence, 
                streamlined workflows, and crystal-clear parent communication.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/parent-login">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-12 py-8 shadow-2xl rounded-2xl font-semibold group transition-all duration-300 hover:scale-105">
                  Start Free Trial 
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-12 py-8 border-2 border-slate-300 hover:bg-slate-100 hover:border-slate-400 rounded-2xl font-semibold group transition-all duration-300">
                <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 pt-12">
              <div className="text-center group">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-sm font-semibold text-slate-600 mt-1">Schools</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">50K+</div>
                <div className="text-sm font-semibold text-slate-600 mt-1">Students</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">98%</div>
                <div className="text-sm font-semibold text-slate-600 mt-1">Satisfaction</div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-slide-in-up">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&h=500&fit=crop&crop=center"
                alt="Students collaborating in modern classroom"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
            
            {/* Enhanced Floating Success Card */}
            <Card className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-xl shadow-2xl border-0 max-w-sm hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-xl">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Application Approved!</p>
                    <p className="text-sm text-slate-600 font-medium">Welcome to Lincoln Elementary</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Floating Stats Card */}
            <Card className="absolute -top-8 -right-8 bg-white/95 backdrop-blur-xl shadow-2xl border-0 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-lg font-bold text-slate-900">95% Faster</p>
                    <p className="text-sm text-slate-600 font-medium">Processing Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-24 space-y-8">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-slate-100 to-blue-100 px-6 py-3 rounded-full border border-slate-200/50">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-slate-700">Core Features</span>
            </div>
            <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight">
              Everything Your School
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Needs & More
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Comprehensive AI-powered tools designed specifically for modern K-12 admissions 
              and enrollment management excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:-translate-y-4 bg-gradient-to-br from-white via-blue-50/20 to-white overflow-hidden">
              <CardContent className="p-12 text-center space-y-8 relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl relative z-10">
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">AI-Powered Processing</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">Advanced algorithms analyze applications and provide intelligent recommendations for faster, more accurate enrollment decisions</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:-translate-y-4 bg-gradient-to-br from-white via-green-50/20 to-white overflow-hidden">
              <CardContent className="p-12 text-center space-y-8 relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100/50 to-emerald-100/50 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl relative z-10">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">Enterprise Security</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">Military-grade encryption and compliance protocols ensure your sensitive data and student information remain completely protected</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:-translate-y-4 bg-gradient-to-br from-white via-purple-50/20 to-white overflow-hidden">
              <CardContent className="p-12 text-center space-y-8 relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/50 to-violet-100/50 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl relative z-10">
                  <Zap className="h-12 w-12 text-white" />
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">Lightning Fast</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">Real-time processing and instant notifications keep parents, students, and administrators perfectly synchronized throughout the process</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Enhanced CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto text-center space-y-12 relative">
          <div className="space-y-8">
            <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent block mt-2">
                School's Future?
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light">
              Join hundreds of forward-thinking schools already using AdmitAI Pro to create exceptional 
              enrollment experiences for families and educational staff.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
            <Link to="/parent-login">
              <Button size="lg" className="w-full sm:w-auto text-lg px-12 py-8 bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-2xl rounded-2xl group transition-all duration-300 hover:scale-105">
                Start Free Trial
                <Sparkles className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-12 py-8 text-white border-2 border-white/40 hover:bg-white/10 hover:border-white/60 font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white py-24 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-10">
            <div className="flex items-center justify-center space-x-5">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl">
                <School className="h-8 w-8" />
              </div>
              <div className="text-left">
                <h3 className="text-4xl font-bold">AdmitAI Pro</h3>
                <p className="text-slate-400 text-lg font-medium">Smart K-12 Enrollment Platform</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed text-lg">
                © 2024 AdmitAI Pro. All rights reserved. Empowering schools and families 
                through intelligent enrollment technology and exceptional user experiences.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                <span>Made with</span>
                <span className="text-red-400">♥</span>
                <span>for education</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
