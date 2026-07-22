import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import RequireRole from "./components/RequireRole.jsx";
import Login from "./pages/Login.jsx";
import Browse from "./pages/attendee/Browse.jsx";
import EventDetail from "./pages/attendee/EventDetail.jsx";
import Checkout from "./pages/attendee/Checkout.jsx";
import Confirmation from "./pages/attendee/Confirmation.jsx";
import OrganizerDashboard from "./pages/organizer/Dashboard.jsx";
import CreateEvent from "./pages/organizer/CreateEvent.jsx";
import Attendees from "./pages/organizer/Attendees.jsx";
import Discounts from "./pages/organizer/Discounts.jsx";
import Settlements from "./pages/organizer/Settlements.jsx";
import GateStaff from "./pages/organizer/GateStaff.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import Scanner from "./pages/scanner/Scanner.jsx";

const org = (el) => <RequireRole roles={["organizer"]}>{el}</RequireRole>;

export default function App() {
  return (
    <div className="shell">
      <Nav />
      <main className="main">
        <Routes>
          {/* Public — no account needed */}
          <Route path="/" element={<Browse />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/login" element={<Login />} />

          {/* Organizer only */}
          <Route path="/organizer" element={org(<OrganizerDashboard />)} />
          <Route path="/organizer/create" element={org(<CreateEvent />)} />
          <Route path="/organizer/edit/:id" element={org(<CreateEvent />)} />
          <Route path="/organizer/attendees" element={org(<Attendees />)} />
          <Route path="/organizer/discounts" element={org(<Discounts />)} />
          <Route path="/organizer/settlements" element={org(<Settlements />)} />
          <Route path="/organizer/staff" element={org(<GateStaff />)} />

          {/* Admin only */}
          <Route path="/admin" element={<RequireRole roles={["admin"]}><AdminDashboard /></RequireRole>} />

          {/* Gate staff only (organizers can also scan their own events) */}
          <Route path="/scanner" element={<RequireRole roles={["gate_staff", "organizer"]}><Scanner /></RequireRole>} />

          <Route path="*" element={<Browse />} />
        </Routes>
      </main>
      <footer className="foot"><div className="wrap"><span>Habari — live events in Ghana. Prototype build.</span><span>Payments via Paystack · GH₵</span></div></footer>
    </div>
  );
}
