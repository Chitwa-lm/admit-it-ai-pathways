
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { School, Users, FileText, CheckCircle, Globe, Heart, BookOpen, Award } from 'lucide-react';
import { useSchools } from '@/hooks/useSchools';
import SchoolImageGallery from '@/components/SchoolImageGallery';

const Landing = () => {
  const { data: schools, isLoading } = useSchools();

  const features = [
    {
      icon: School,
      title: 'Quality Zambian Schools',
      description: 'Access to premier educational institutions across all provinces of Zambia',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: FileText,
      title: 'Simple Application Process',
      description: 'Streamlined enrollment process designed for Zambian families',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: CheckCircle,
      title: 'Real-time Updates',
      description: 'Track your application status and receive instant notifications',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Heart,
      title: 'Family-Centered Approach',
      description: 'Supporting Zambian families in finding the perfect educational fit',
      color: 'from-orange-500 to-red-600'
    },
  ];

  const stats = [
    { number: '50+', label: 'Partner Schools', subtext: 'Across Zambia' },
    { number: '15K+', label: 'Students Enrolled', subtext: 'Success Stories' },
    { number: '98%', label: 'Satisfaction Rate', subtext: 'Happy Families' },
    { number: '10', label: 'Provinces Covered', subtext: 'Nationwide Access' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl">
                <School className="h-10 w-10" />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-400 w-6 h-6 rounded-full shadow-lg flex items-center justify-center">
                <Globe className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
            Your Child's Future Starts Here
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connecting Zambian families with exceptional educational opportunities. 
            From Lusaka to Livingstone, find the perfect school for your child's journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/parent-login">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                <Users className="mr-2 h-5 w-5" />
                Start Your Application
              </Button>
            </Link>
            <Link to="/admin-login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 hover:bg-slate-50 shadow-lg">
                <School className="mr-2 h-5 w-5" />
                School Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-slate-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-slate-600">
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Choose AdmitAI Pro?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Designed specifically for Zambian families, our platform makes school enrollment simple, transparent, and stress-free.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Schools Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Featured Schools Across Zambia
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover exceptional educational institutions from Lusaka to rural communities, 
              each committed to excellence in Zambian education.
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading schools...</p>
            </div>
          ) : (
            <SchoolImageGallery schools={schools || []} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Secure Your Child's Future?
          </h2>
          <p className="text-xl mb-12 opacity-90 leading-relaxed">
            Join thousands of Zambian families who have found their perfect school match. 
            Start your journey today and give your child the education they deserve.
          </p>
          <Link to="/parent-login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-slate-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
              <BookOpen className="mr-2 h-5 w-5" />
              Begin Application Process
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
