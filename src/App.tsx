
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
import VoiceDemoPage from "./pages/VoiceDemoPage";
import { DatabaseConnectionStatus } from "./components/DatabaseConnectionStatus";
import SchoolAdminDashboard from "./pages/SchoolAdminDashboard";
import DatabaseTestPage from "./pages/DatabaseTestPage";
import RouteGuard from "./components/RouteGuard";
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
            <DatabaseConnectionStatus />
            <RouteGuard>
              <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/parent-login" element={<ParentLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/parent-portal" element={<ParentPortal />} />
              <Route path="/application" element={<ApplicationForm />} />
              <Route path="/documents" element={<DocumentUpload />} />
              <Route path="/admin" element={<SchoolAdminDashboard />} />
              <Route path="/test-database" element={<DatabaseTestPage />} />
              <Route path="/voice-demo" element={<VoiceDemoPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </RouteGuard>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
