import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import SiteHeader from "@/components/SiteHeader";
import CampaignPage from "@/pages/CampaignPage";
import CommunityPage from "@/pages/CommunityPage";
import ProfilePage from "@/pages/ProfilePage";
import ErrorBoundary from "@/components/ErrorBoundary";

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
        <Routes>
          <Route path="/campaign/:id" element={<CampaignPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/campaign/campaign-1" replace />} />
        </Routes>
      </ErrorBoundary>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  );
}

export default App;
