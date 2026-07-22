// ---------------------------------------------------------------------------
// lib/auth.jsx — who is logged in, app-wide.
//
// On login we call the backend's POST /auth/login, which returns a signed
// token + the user (with their role). We keep both in localStorage so a page
// refresh doesn't log you out. REMEMBER: hiding pages here is cosmetic — the
// backend re-checks the token's role on every request (the real lock).
// ---------------------------------------------------------------------------
import { createContext, useContext, useState, useCallback } from "react";
import { API_BASE } from "./api.js";

const KEY = "habari_session";
const Ctx = createContext(null);

function loadSession() {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession); // { token, user } | null

  const login = useCallback(async (email, password) => {
    const res = await fetch(API_BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Login failed");
    const next = { token: data.token, user: data.user };
    setSession(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    return data.user;
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    const res = await fetch(API_BASE + "/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Google sign-in failed");
    const next = { token: data.token, user: data.user };
    setSession(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    return data; // { user, isNew }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    try { localStorage.removeItem(KEY); } catch {}
  }, []);

  // fetch() wrapper that attaches the login token for protected API calls.
  const authFetch = useCallback(async (path, opts = {}) => {
    const res = await fetch(API_BASE + path, {
      ...opts,
      headers: { "Content-Type": "application/json", ...(opts.headers || {}), ...(session ? { Authorization: "Bearer " + session.token } : {}) },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }, [session]);

  const value = { user: session?.user || null, token: session?.token || null, login, loginWithGoogle, logout, authFetch };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

// Where each role lands after logging in.
export const ROLE_HOME = { organizer: "/organizer", admin: "/admin", gate_staff: "/scanner", attendee: "/" };
