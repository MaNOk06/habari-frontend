import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "../lib/auth.jsx";

// What each role sees in the nav. Attendees (not signed in) see the public site.
const LINKS = {
  attendee: [
    { to: "/", label: "Events", end: true },
    { to: "/organizer", label: "Sell tickets" },
  ],
  organizer: [
    { to: "/organizer", label: "Dashboard", end: true },
    { to: "/organizer/create", label: "Create" },
    { to: "/organizer/discounts", label: "Discounts" },
    { to: "/organizer/settlements", label: "Settlements" },
    { to: "/organizer/staff", label: "Staff" },
  ],
  admin: [
    { to: "/", label: "Events", end: true },
    { to: "/admin", label: "Admin overview" },
  ],
  gate_staff: [{ to: "/scanner", label: "Check-in", end: true }],
};

export default function Nav() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const links = LINKS[user?.role || "attendee"];
  const signOut = () => { logout(); nav("/"); };

  return (
    <nav className="nav">
      <div className="nav-bar">
        <Link to="/" className="brand" aria-label="Habari home"><span className="brand-dot" /><span className="brand-name">Habari</span></Link>
        <div className="nav-links">
          {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "on" : "")}>{l.label}</NavLink>)}
        </div>
        <div className="nav-user">
          {user ? (
            <>
              <span className="nav-who">{user.name} <em>· {user.role.replace("_", " ")}</em></span>
              <button className="btn ghost sm" onClick={signOut}><LogOut size={14} /> Sign out</button>
            </>
          ) : (
            <Link className="btn sm" to="/login"><LogIn size={14} /> Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
