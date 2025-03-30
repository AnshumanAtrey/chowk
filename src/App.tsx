
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { ServiceProvider } from '@/contexts/ServiceContext';
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import CreateServicePage from "@/pages/CreateServicePage";
import EditServicePage from "@/pages/EditServicePage";
import DashboardPage from "@/pages/DashboardPage";
import { LoginPage, RegisterPage } from "@/pages/AuthPages";
import ProfilePage from "@/pages/ProfilePage";
import CategoryPage from "@/pages/CategoryPage";
import AboutUsPage from "@/pages/about/AboutUsPage";
import ContactPage from "@/pages/about/ContactPage";
import PrivacyPolicyPage from "@/pages/about/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/about/TermsOfServicePage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ServiceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/services/new" element={<CreateServicePage />} />
              <Route path="/services/edit/:id" element={<EditServicePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Category Pages */}
              <Route path="/category/:category" element={<CategoryPage />} />
              
              {/* Company Pages */}
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ServiceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
