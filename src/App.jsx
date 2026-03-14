import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ErrorBoundary from "@/components/ErrorBoundary";
import NotFound from "@/components/NotFound";

const CampaignPage = lazy(() => import("@/pages/CampaignPage"));
const CommunityPage = lazy(() => import("@/pages/CommunityPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <TooltipProvider>
      <ScrollToTop />
      <SiteHeader />
      <ErrorBoundary>
        <main id="main-content">
        <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/campaign/:id" element={<CampaignPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </main>
      </ErrorBoundary>
      <SiteFooter />
      <Toaster position="bottom-right" />
    </TooltipProvider>
  );
}

export default App;
