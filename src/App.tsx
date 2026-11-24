import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";

const Index = lazy(() => import("./pages/Index"));
const Explore = lazy(() => import("./pages/Explore"));
const Learn = lazy(() => import("./pages/Learn"));
const DivisionWork = lazy(() => import("./pages/DivisionWork"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const AdminAuth = lazy(() => import("./pages/AdminAuth"));
const AdminCertificates = lazy(() => import("./pages/AdminCertificates"));
const CertificateVerification = lazy(() => import("./pages/CertificateVerification"));
const NotFound = lazy(() => import("./pages/NotFound"));

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
  </div>
);

const RouteScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => {
        try {
          const targetId = decodeURIComponent(hash.slice(1));
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch {
          // Ignore malformed URL hashes rather than crashing route rendering.
        }
      }, 80);
      return () => window.clearTimeout(timer);
    }

    const sectionMap: Record<string, string> = {
      "/about": "solutions",
      "/services": "products",
      "/products": "pricing",
      "/contact": "contact",
      "/internship": "internship",
      "/internships": "internship",
      "/internship/apply": "internship",
      "/internships/apply": "internship",
      "/intenship/apply": "internship",
    };

    const targetSection = sectionMap[pathname];
    if (targetSection) {
      const timer = window.setTimeout(() => {
        document.getElementById(targetSection)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

const App = () => (
  <BrowserRouter>
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <RouteScrollManager />
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<Index />} />
            <Route path="/services" element={<Index />} />
            <Route path="/products" element={<Index />} />
            <Route path="/contact" element={<Index />} />
            <Route path="/internship" element={<Index />} />
            <Route path="/internships" element={<Index />} />
            <Route path="/internship/apply" element={<Index />} />
            <Route path="/internships/apply" element={<Index />} />
            <Route path="/intenship/apply" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/work/:divisionId" element={<DivisionWork />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/admin/login" element={<AdminAuth />} />
            <Route path="/admin/certificates" element={<AdminCertificates />} />
            <Route path="/verify/:certificateId" element={<CertificateVerification />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
    <Sonner />
  </BrowserRouter>
);

export default App;
