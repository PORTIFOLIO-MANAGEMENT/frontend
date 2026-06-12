import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "./AuthShell";
import { fieldStyle, labelStyle, submitStyle } from "./authStyles";
import { colors, fonts } from "../../styles/theme";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Clients stay on the public site (where they came from, or the landing page);
  // admins go to the studio console.
  const dest = location.state?.from?.pathname || "/";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/studio" : dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="LOG IN"
      subtitle="Welcome back."
      footer={<>No account? <Link to="/register" style={{ color: colors.accentText }}>Create one</Link></>}
    >
      <form onSubmit={submit}>
        <label style={labelStyle}>EMAIL</label>
        <input type="email" required value={form.email} autoComplete="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} style={fieldStyle} />

        <label style={labelStyle}>PASSWORD</label>
        <input type="password" required value={form.password} autoComplete="current-password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} style={fieldStyle} />

        {error && <p style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.pink, margin: "4px 0 10px" }}>{error}</p>}

        <button type="submit" disabled={busy} style={{ ...submitStyle, opacity: busy ? 0.6 : 1 }}>
          {busy ? "…" : "ENTER"}
        </button>
      </form>
    </AuthShell>
  );
}
