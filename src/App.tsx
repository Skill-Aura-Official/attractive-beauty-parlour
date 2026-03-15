import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Offers from "./pages/Offers";
import Kids from "./pages/Kids";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageServices from "./pages/admin/ManageServices";
import ManageOffers from "./pages/admin/ManageOffers";
import ManageTestimonials from "./pages/admin/ManageTestimonials";
import ManageBlog from "./pages/admin/ManageBlog";
import ManageMedia from "./pages/admin/ManageMedia";
import ManageContact from "./pages/admin/ManageContact";
import ManageHeroSlides from "./pages/admin/ManageHeroSlides";
import ManageFAQ from "./pages/admin/ManageFAQ";
import ManagePages from "./pages/admin/ManagePages";
import ManageLeads from "./pages/admin/ManageLeads";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="hero" element={<ManageHeroSlides />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="offers" element={<ManageOffers />} />
            <Route path="testimonials" element={<ManageTestimonials />} />
            <Route path="blog" element={<ManageBlog />} />
            <Route path="faq" element={<ManageFAQ />} />
            <Route path="pages" element={<ManagePages />} />
            <Route path="media" element={<ManageMedia />} />
            <Route path="contact" element={<ManageContact />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
