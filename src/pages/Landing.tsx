
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
  Clipboard
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
              K12
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                K-12 AdmitAI
              </h1>
              <p className="text-sm text-gray-600 font-medium">Student Enrollment Made Simple</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link to="/parent-login">
              <Button variant="outline" className="font-semibold">Parent Login</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transforming
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                  K-12 Admissions
                </span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed max-w-lg">
                Streamline your school enrollment process with AI-powered insights, 
                real-time tracking, and seamless parent collaboration.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/parent-login">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6 shadow-xl">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-blue-50">
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Schools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Success Card */}
            <Card className="absolute -bottom-8 -left-8 bg-white shadow-2xl border-0 max-w-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Application Approved!</p>
                    <p className="text-sm text-gray-600">Welcome to Lincoln Elementary</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Everything Your School Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for K-12 admissions and enrollment management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8 text-center space-y-4">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Smart Processing</h3>
                <p className="text-gray-600 leading-relaxed">AI-powered application analysis helps schools make informed enrollment decisions faster than ever</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8 text-center space-y-4">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Secure Portal</h3>
                <p className="text-gray-600 leading-relaxed">Parents can safely upload documents, track progress, and communicate with schools through our secure platform</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8 text-center space-y-4">
                <div className="bg-gradient-to-br from-purple-100 to-violet-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Real-time Updates</h3>
                <p className="text-gray-600 leading-relaxed">Instant notifications keep families informed at every step of the enrollment journey</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Education Focused Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=450&fit=crop&crop=center"
                alt="Elementary school children raising hands in classroom"
                className="rounded-3xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">K-12 Ready</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  Built for Every Grade Level
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  From kindergarten to graduation, our platform adapts to every stage of your students' educational journey.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <School className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Elementary Focus</h4>
                    <p className="text-sm text-gray-600">Age-appropriate processes for youngest learners</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Middle School</h4>
                    <p className="text-sm text-gray-600">Transition support for growing students</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">High School</h4>
                    <p className="text-sm text-gray-600">College prep and career readiness</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Clipboard className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Special Programs</h4>
                    <p className="text-sm text-gray-600">Gifted, IEP, and specialized tracks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-12 text-center space-y-8">
              <div className="flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-2xl lg:text-3xl font-medium text-gray-900 leading-relaxed">
                "K-12 AdmitAI revolutionized our enrollment process. What used to take weeks 
                now takes days, and parents absolutely love the transparency and ease of use."
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
                  alt="School principal testimonial"
                  className="w-16 h-16 rounded-full shadow-lg"
                />
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-lg">Dr. Sarah Chen</p>
                  <p className="text-gray-600">Principal, Washington Elementary</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            Ready to Transform Your School's Admissions?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of schools already using K-12 AdmitAI to create smoother, 
            more efficient enrollment experiences for families and staff.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/parent-login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-xl">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 text-white border-2 border-white hover:bg-white/10 font-semibold">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl">
                K12
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold">K-12 AdmitAI</h3>
                <p className="text-gray-400">Student Enrollment Made Simple</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              © 2024 K-12 AdmitAI. All rights reserved. Empowering schools and families 
              through innovative enrollment technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
