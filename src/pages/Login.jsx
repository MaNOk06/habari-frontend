import { useState, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LogIn, AlertCircle } from "lucide-react";
import { useAuth, ROLE_HOME } from "../lib/auth.jsx";
import GoogleButton from "../components/GoogleButton.jsx";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const nav = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const goHome = (user) => nav(state?.from || ROLE_HOME[user.role] || "/", { replace: true });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const user = await login(form.email.trim(), form.password);
      goHome(user);
    } catch (err) {
      setError(err.message.includes("fetch") ? "Can't reach the server — is the backend running?" : err.message);
      setBusy(false);
    }
  };

  const onGoogle = useCallback(async (credential) => {
    setError(""); setNote("");
    try {
      const { user, isNew } = await loginWithGoogle(credential);
      if (isNew) {
        setNote("Organizer account created — it's pending admin approval. You can set up now; publishing unlocks once approved.");
        setTimeout(() => goHome(user), 1800);
      } else {
        goHome(user);
      }
    } catch (err) {
      setError(err.message.includes("fetch") ? "Can't reach the server — is the backend running?" : err.message);
    }
  }, [loginWithGoogle]);

  return (
    <div className="wrap">
      <div className="login-card panel" style={{ transform: "rotate(-0.5deg)" }}>
        <h3><LogIn size={16} /> Organizer sign in</h3>
        <form onSubmit={submit}>
          <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set("email")} placeholder="organizer@habari.gh" autoFocus /></div>
          <div className="field"><label>Password</label><input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" /></div>
          {error && <div className="notice err" style={{ marginTop: 14 }}><AlertCircle size={15} /> {error}</div>}
          {note && <div className="notice" style={{ marginTop: 14 }}>{note}</div>}
          <button className="btn flame block lg" style={{ marginTop: 18 }} disabled={busy || !form.email || !form.password}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>

        <GoogleButton onCredential={onGoogle} onError={(m) => setError(m)} />

      </div>
      <p style={{ textAlign: "center" }}><Link to="/" className="link-back">← Back to events</Link></p>
    </div>
  );
}
