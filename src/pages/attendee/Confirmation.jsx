import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Check, MapPin, QrCode } from "lucide-react";
import { CATEGORY_COLOR } from "../../data/mock.js";
import QRCodeSvg from "../../components/QRCode.jsx";

export default function Confirmation() {
  const { state } = useLocation();
  const nav = useNavigate();
  if (!state?.order || !state?.event) return <Navigate to="/" replace />;
  const { event: ev, order } = state;
  const tickets = order.tickets || [];

  return (
    <div className="wrap" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="done">
        <div className="badge"><Check size={30} /></div>
        <h1>You're in</h1>
        <p>{tickets.length} ticket{tickets.length === 1 ? "" : "s"} sent to <b>{order.buyer?.email}</b>. Order <b>{order.reference}</b>.</p>
      </div>
      <div className="tickets">
        {tickets.map((tk) => (
          <div key={tk.id} className="tkt">
            <div className="tkt-l" style={{ background: CATEGORY_COLOR[ev.category] }}>
              <span className="poster-tag">{ev.category}</span>
              <h4 style={{ marginTop: 12 }}>{ev.title}</h4>
              <span className="type">{tk.type || "Ticket"}</span>
              <div className="when">{ev.date} · {ev.time}</div>
              <div className="when" style={{ fontWeight: 400, opacity: 0.9 }}><MapPin size={12} style={{ verticalAlign: "-1px" }} /> {ev.venue}</div>
            </div>
            <div className="tkt-perf" />
            <div className="tkt-r">
              <QRCodeSvg seed={tk.qrToken || tk.id} />
              <span className="id mono">{tk.id.slice(0, 13)}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--flame)", display: "flex", alignItems: "center", gap: 4 }}><QrCode size={11} /> Scan at entry</span>
            </div>
          </div>
        ))}
      </div>
      <button className="btn block" onClick={() => nav("/")}>Back to events</button>
    </div>
  );
}
