import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { colors, fonts } from "../styles/theme";

// Route guard: blocks unauthenticated users (and optionally non-admins) and
// redirects to /login, preserving the intended destination.
export default function RequireAuth({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: colors.bg, color: colors.textMuted,
        fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2,
      }}>
        AUTHENTICATING…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
