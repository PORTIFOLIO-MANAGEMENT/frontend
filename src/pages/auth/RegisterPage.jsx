import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "./AuthShell";
import { fieldStyle, labelStyle, submitStyle } from "./authStyles";
import { colors, fonts } from "../../styles/theme";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", company: "", password: "", password_confirmation: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setBusy(true);
    try {
      await register(form);
      navigate("/", { replace: true }); // new clients land on the public site, not a separate dashboard
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ _: ["Registration failed. Try again."] });
      }
    } finally {
      setBusy(false);
    }
  };

  const fieldError = (k) => errors[k]?.[0];

  return (
    <AuthShell
      title="REGISTER"
      subtitle="Create an account to book & chat."
      footer={<>Already have one? <Link to="/login" style={{ color: colors.accentText }}>Log in</Link></>}
    >
      <form onSubmit={submit}>
        <label style={labelStyle}>NAME</label>
        <input type="text" required value={form.name} onChange={update("name")} style={fieldStyle} />
        <Err msg={fieldError("name")} />

        <label style={labelStyle}>EMAIL</label>
        <input type="email" required value={form.email} autoComplete="email" onChange={update("email")} style={fieldStyle} />
        <Err msg={fieldError("email")} />

        <label style={labelStyle}>COMPANY (OPTIONAL)</label>
        <input type="text" value={form.company} onChange={update("company")} style={fieldStyle} />

        <label style={labelStyle}>PASSWORD</label>
        <input type="password" required value={form.password} autoComplete="new-password" onChange={update("password")} style={fieldStyle} />
        <Err msg={fieldError("password")} />

        <label style={labelStyle}>CONFIRM PASSWORD</label>
        <input type="password" required value={form.password_confirmation} autoComplete="new-password" onChange={update("password_confirmation")} style={fieldStyle} />

        {errors._ && <Err msg={errors._[0]} />}

        <button type="submit" disabled={busy} style={{ ...submitStyle, opacity: busy ? 0.6 : 1 }}>
          {busy ? "…" : "CREATE ACCOUNT"}
        </button>
      </form>
    </AuthShell>
  );
}

function Err({ msg }) {
  if (!msg) return null;
  return <p style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.pink, margin: "-8px 0 10px" }}>{msg}</p>;
}
