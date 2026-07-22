import { useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { ORGANIZERS, SETTLEMENTS } from "../../data/mock.js";
import { cedi } from "../../lib/format.js";
export default function AdminDashboard() {
  const [orgs, setOrgs] = useState(ORGANIZERS);
  const [settlements, setSettlements] = useState(SETTLEMENTS);
  const decide = (id, status) => setOrgs((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
  const release = (id) => setSettlements((s) => s.map((x) => (x.id === id ? { ...x, status: "Processing" } : x)));
  const totalRevenue = settlements.reduce((s, x) => s + x.gross, 0);
  const pending = orgs.filter((o) => o.status === "Pending").length;
  const pill = (s) => s === "Paid" ? "green" : s === "Processing" ? "flame" : "amber";
  return (
    <div className="wrap">
      <div className="page-head"><div><h1>Platform overview</h1><div className="sub">Habari admin console</div></div></div>
      <div className="stats">
        <div className="stat"><div className="k">Revenue processed</div><div className="v flame">{cedi(totalRevenue)}</div></div>
        <div className="stat"><div className="k">Organizers</div><div className="v">{orgs.filter((o) => o.status === "Approved").length}</div></div>
        <div className="stat"><div className="k">Pending approval</div><div className="v">{pending}</div></div>
        <div className="stat"><div className="k">Events live</div><div className="v">6</div></div>
      </div>
      <div className="tablecard" style={{ marginBottom: 22 }}>
        <div className="cap"><h3>Organizer approvals</h3></div>
        <table className="t">
          <thead><tr><th>Organizer</th><th>Contact</th><th>Bank</th><th>Status</th><th style={{ textAlign: "right" }}>Action</th></tr></thead>
          <tbody>
            {orgs.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>{o.name}</td><td>{o.contact}</td><td>{o.bank}</td>
                <td><span className={"pill " + (o.status === "Approved" ? "green" : o.status === "Suspended" ? "grey" : "amber")}>{o.status}</span></td>
                <td style={{ textAlign: "right" }}>{o.status === "Pending" ? <span style={{ display: "inline-flex", gap: 6 }}><button className="btn flame sm" onClick={() => decide(o.id, "Approved")}><Check size={13} /> Approve</button><button className="btn ghost sm" onClick={() => decide(o.id, "Suspended")}><X size={13} /> Reject</button></span> : <span style={{ color: "var(--ink-soft)", fontSize: 13 }}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tablecard">
        <div className="cap"><h3>Settlements</h3><span className="sub" style={{ margin: 0 }}>Platform-managed payouts</span></div>
        <table className="t">
          <thead><tr><th>Event</th><th>Organizer</th><th>Gross</th><th>Fees</th><th>Payout</th><th>Status</th><th style={{ textAlign: "right" }}>Action</th></tr></thead>
          <tbody>
            {settlements.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.event}</td><td>{s.organizer}</td><td>{cedi(s.gross)}</td><td>{cedi(s.fees)}</td><td style={{ fontWeight: 600 }}>{cedi(s.payout)}</td>
                <td><span className={"pill " + pill(s.status)}>{s.status}</span></td>
                <td style={{ textAlign: "right" }}>{s.status === "Pending" ? <button className="btn sm" onClick={() => release(s.id)}>Release <ArrowRight size={13} /></button> : <span style={{ color: "var(--ink-soft)", fontSize: 13 }}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
