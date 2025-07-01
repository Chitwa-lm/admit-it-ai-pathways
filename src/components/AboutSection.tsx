
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  FileText, 
  CheckCircle,
  GraduationCap,
  Clock,
  Award,
  Sparkles
} from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms analyze applications, detect patterns, and provide intelligent recommendations to streamline your enrollment process.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade encryption, FERPA compliance, and multi-layer security protocols ensure your sensitive data remains completely protected.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Process applications 10x faster with automated document verification, real-time validation, and instant status updates for families.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: Users,
      title: "Seamless Collaboration",
      description: "Connect administrators, teachers, parents, and students on one unified platform with role-based access and real-time communication.",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: FileText,
      title: "Smart Document Management",
      description: "Automatically extract, validate, and organize documents with AI-powered OCR and intelligent filing systems.",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      icon: CheckCircle,
      title: "Automated Workflows",
      description: "Eliminate manual tasks with intelligent automation that handles routine processes while keeping humans in control of key decisions.",
      gradient: "from-emerald-500 to-green-600"
    }
  ];

  const stats = [
    { number: "95%", label: "Faster Processing", icon: Clock },
    { number: "500+", label: "Schools Trust Us", icon: GraduationCap },
    { number: "99.9%", label: "Uptime Guarantee", icon: Shield },
    { number: "50K+", label: "Students Enrolled", icon: Users }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full border border-blue-200/50">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">About AdmitAI Pro</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            Revolutionizing School
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block">
              Enrollment Forever
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            AdmitAI Pro combines cutting-edge artificial intelligence with intuitive design to transform 
            how K-12 schools manage student enrollment. Our platform eliminates paperwork bottlenecks, 
            reduces administrative burden, and creates transparent, efficient experiences for families.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-slate-700" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8 space-y-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                <div className={`bg-gradient-to-br ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-3 relative z-10">
                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 border-0 shadow-2xl">
            <CardContent className="p-12 text-white">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">Our Mission</h3>
                <p className="text-xl leading-relaxed text-blue-100">
                  We believe every child deserves access to quality education, and every school deserves 
                  tools that make enrollment simple, transparent, and fair. AdmitAI Pro empowers educators 
                  to focus on what matters most—teaching and nurturing the next generation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
