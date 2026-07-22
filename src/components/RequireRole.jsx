// ---------------------------------------------------------------------------
// The route guard. Wraps a protected area of the app:
//   not signed in            -> send to /login (remembering where they wanted to go)
//   signed in, wrong role    -> send to their own home (no snooping)
//   signed in, right role    -> show the page
// This is the FRONTEND half (cosmetic). The backend independently re-checks
// the token's role on every API request — that's the real security.
// ---------------------------------------------------------------------------
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../lib/auth.jsx";

export default function RequireRole({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!roles.includes(user.role)) return <Navigate to={ROLE_HOME[user.role] || "/"} replace />;
  return children;
}
