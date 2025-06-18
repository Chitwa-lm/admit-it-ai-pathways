
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
  Zap
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
              K12
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">K-12 AdmitAI</h1>
              <p className="text-sm text-gray-500">Student Enrollment Made Simple</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/parent-login">
              <Button variant="outline">Parent Login</Button>
            </Link>
            <Link to="/">
              <Button>Admin Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Simplify School
              <span className="text-primary block">Admissions</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Streamline your K-12 school enrollment process with AI-powered analysis, 
              real-time tracking, and seamless parent portal integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/parent-login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&crop=center"
              alt="Parent using laptop for school applications"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-semibold text-gray-900">Application Submitted</p>
                  <p className="text-sm text-gray-600">Processing time: 2-3 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for School Admissions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform handles every aspect of the enrollment process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <School className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Application Processing</h3>
                <p className="text-gray-600">AI-powered analysis helps schools make informed decisions faster</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Parent Portal</h3>
                <p className="text-gray-600">Parents can track applications and upload documents securely</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
                <p className="text-gray-600">Monitor application status and get instant updates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop&crop=center"
                alt="Students using technology in classroom"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
            
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Trusted by Schools Nationwide
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-gray-600">Schools Using Platform</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-gray-600">Applications Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">98%</div>
                  <div className="text-gray-600">Parent Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-gray-600">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <blockquote className="text-2xl lg:text-3xl font-medium text-gray-900 mb-6">
            "K-12 AdmitAI transformed our enrollment process. What used to take weeks 
            now takes days, and parents love the transparency."
          </blockquote>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=80&h=80&fit=crop&crop=face"
              alt="School administrator testimonial"
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold text-gray-900">Sarah Johnson</p>
            <p className="text-gray-600">Principal, Lincoln Elementary</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Simplify Your Admissions Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of schools already using K-12 AdmitAI to streamline their enrollment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/parent-login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
              K12
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold">K-12 AdmitAI</h3>
              <p className="text-sm text-gray-400">Student Enrollment Made Simple</p>
            </div>
          </div>
          <p className="text-gray-400">
            © 2024 K-12 AdmitAI. All rights reserved. Making school admissions easier for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
