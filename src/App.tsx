
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import ParentLogin from "./pages/ParentLogin";
import AdminLogin from "./pages/AdminLogin";
import ParentPortal from "./pages/ParentPortal";
import ApplicationForm from "./pages/ApplicationForm";
import DocumentUpload from "./pages/DocumentUpload";
import SchoolAdminDashboard from "./pages/SchoolAdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground transition-colors">
            <Navigation />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/parent-login" element={<ParentLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/parent-portal" element={<ParentPortal />} />
              <Route path="/application" element={<ApplicationForm />} />
              <Route path="/documents" element={<DocumentUpload />} />
              <Route path="/admin" element={<SchoolAdminDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
