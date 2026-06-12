import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AIWidget from "../components/AIWidget";
import AccountDrawer from "../components/AccountDrawer";
import OnboardingTour from "../components/OnboardingTour";
import { useOnboarding } from "../hooks/useOnboarding";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Public-facing chrome shared across marketing + showcase routes: nav, the ARIA
// AI launcher, the signed-in Account drawer, the onboarding tour, and footer.
// Page bodies render through <Outlet/>.
export default function Layout() {
  const [aiOpen, setAiOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  // Tour auto-runs once for a signed-in client on the landing page; replayable
  // from the Account drawer.
  const { active: tourActive, start: startTour, finish: finishTour } =
    useOnboarding(isAuthenticated && pathname === "/");

  return (
    <>
      <Navbar setAiOpen={setAiOpen} setAccountOpen={setAccountOpen} />

      <Outlet />

      <Footer />

      <AccountDrawer open={accountOpen} onClose={() => setAccountOpen(false)} onReplayTour={startTour} />
      {isAuthenticated && <OnboardingTour active={tourActive} onFinish={finishTour} />}

      {aiOpen && <AIWidget onClose={() => setAiOpen(false)} />}
      {!aiOpen && (
        <button
          data-hover
          data-tour="aria"
          onClick={() => setAiOpen(true)}
          aria-label="Ask ARIA"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 999,
            width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg,#C8F53B,#7B61FF)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, color: "#000",
            boxShadow: "0 8px 32px rgba(200,245,59,0.3)",
            animation: "pulse 3s infinite",
          }}
        >
          A
        </button>
      )}
    </>
  );
}
