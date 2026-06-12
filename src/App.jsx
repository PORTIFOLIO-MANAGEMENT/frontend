import { Routes, Route } from "react-router-dom";
import { globalCss } from "./styles/globalCss";
import Layout from "./layout/Layout";
import HomePage from "./pages/home/HomePage";
import WorkPage from "./pages/work/WorkPage";
import ProjectDetailPage from "./pages/work/ProjectDetailPage";
import ServicesPage from "./pages/services/ServicesPage";
import BookPage from "./pages/book/BookPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import StudioPage from "./pages/studio/StudioPage";
import NotFoundPage from "./pages/NotFoundPage";
import RequireAuth from "./components/RequireAuth";
import { AnalyticsProvider } from "./context/AnalyticsContext";

export default function App() {
  return (
    <AnalyticsProvider>
      <style>{globalCss}</style>
      <Routes>
        {/* Public marketing + showcase routes share the Layout chrome */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/book" element={<BookPage />} />
        </Route>

        {/* Auth screens (no marketing chrome) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated client dashboard */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />

        {/* Studio admin (the two partners) */}
        <Route
          path="/studio/*"
          element={
            <RequireAuth requireAdmin>
              <StudioPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnalyticsProvider>
  );
}
