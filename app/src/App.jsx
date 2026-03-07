import { Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import CampaignPage from "@/pages/CampaignPage";
import CommunityPage from "@/pages/CommunityPage";
import ProfilePage from "@/pages/ProfilePage";

function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/campaign/:id" element={<CampaignPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/campaign/1" replace />} />
      </Routes>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  );
}

export default App;
