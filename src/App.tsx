import { Navigate, Route, Routes } from "react-router-dom";

import LaunchPage from "./pages/LaunchPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import FindJob from "./pages/FindJob.tsx";
import AvailableJobs from "./pages/AvailableJobs.tsx";
import TrendingJobs from "./pages/TrendingJobs.tsx";
import MarketStatus from "./pages/MarketStatus.tsx";
import ResumeAI from "./pages/ResumeAI.tsx";
import Roadmap from "./pages/Roadmap.tsx";
import Profile from "./pages/Profile.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LaunchPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/find-job" element={<FindJob />} />
      <Route path="/available-jobs" element={<AvailableJobs />} />
      <Route path="/trending-jobs" element={<TrendingJobs />} />
      <Route path="/market-status" element={<MarketStatus />} />
      <Route path="/resume-ai" element={<ResumeAI />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;