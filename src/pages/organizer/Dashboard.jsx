import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, TrendingUp, Pencil, QrCode, Users, Ticket, Tag, Wallet, UserCheck, ScanLine } from "lucide-react";
import { useStore } from "../../lib/store.jsx";
import { SALES_7D, ORG_SETTLEMENTS } from "../../data/mock.js";
import { cedi, isUpcoming } from "../../lib/format.js";
import EventQRModal from "../../components/EventQRModal.jsx";

const soldOf = (e) => e.tickets.reduce((a, t) => a + (t.sold || 0), 0);
const capOf = (e) => e.tickets.reduce((a, t) => a + t.total, 0);
const revOf = (e) => e.tickets.reduce((a, t) => a + (t.sold || 0) * t.price, 0);

export default function OrganizerDashboard() {
  const { myEvents, canEdit } = useStore();
  const [tab, setTab] = useState("upcoming");
  const [qrEvent, setQrEvent] = useState(null);

  const upcoming = myEvents.filter(isUpcoming);
  const past = myEvents.filter((e) => !isUpcoming(e));
  const shown = tab === "upcoming" ? upcoming : past;

  const totalSold = myEvents.reduce((s, e) => s + soldOf(e), 0);
  const totalRev = myEvents.reduce((s, e) => s + revOf(e), 0);
  const nextPayout = ORG_SETTLEMENTS.find((s) => s.status !== "Paid");

  return (
    <div className="wrap">
      <div className="page-head">
        <div><h1>Dashboard</h1><div className="sub">Nights Collective · Accra</div></div>
        <Link className="btn flame" to="/organizer/create"><Plus size={16} /> Create event</Link>
      </div>

      <div className="stats">
        <div className="stat"><div className="k">Tickets sold</div><div className="v">{totalSold.toLocaleString()}</div></div>
        <div className="stat"><div className="k">Gross revenue</div><div className="v flame">{cedi(totalRev)}</div></div>
        <div className="stat"><div className="k">Events</div><div className="v">{myEvents.length}</div></div>
        <div className="stat"><div className="k">Next payout</div><div className="v" style={{ fontSize: 24 }}>{nextPayout ? cedi(nextPayout.payout) : "\u2014"}</div></div>
      </div>

      <div className="org-grid">
        <div>
          <div className="tablecard" style={{ marginBottom: 20 }}>
            <div className="cap"><h3><TrendingUp size={16} style={{ verticalAlign: "-3px" }} /> Sales · last 7 days</h3></div>
            <div className="bars">{SALES_7D.map((d) => <div key={d.d} className="bar" style={{ height: `${(d.v / 156) * 100}%` }}><span>{d.d}</span></div>)}</div>
            <div style={{ height: 22 }} />
          </div>

          <div className="tablecard">
            <div className="cap">
              <div className="tabs">
                <button className={"tab" + (tab === "upcoming" ? " on" : "")} onClick={() => setTab("upcoming")}>Upcoming ({upcoming.length})</button>
                <button className={"tab" + (tab === "past" ? " on" : "")} onClick={() => setTab("past")}>Past ({past.length})</button>
              </div>
            </div>
            {shown.length === 0 ? (
              <div className="empty" style={{ padding: "40px 20px" }}><Ticket size={22} /><p>No {tab} events yet.</p></div>
            ) : (
              <table className="t">
                <thead><tr><th>Event</th><th>Date</th><th>Sold</th><th>Revenue</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
                <tbody>
                  {shown.map((e) => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 600 }}>{e.title}<div style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 400 }}>{e.venue}</div></td>
                      <td>{e.date}</td>
                      <td>{soldOf(e)} / {capOf(e)}</td>
                      <td>{cedi(revOf(e))}</td>
                      <td>
                        <div className="row-actions">
                          {canEdit(e.id)
                            ? <Link className="btn ghost sm" to={`/organizer/edit/${e.id}`}><Pencil size={13} /> Edit</Link>
                            : <span className="btn ghost sm" title="Seeded demo event \u2014 editable via the API" style={{ opacity: .4, cursor: "not-allowed" }}><Pencil size={13} /> Edit</span>}
                          <button className="btn ghost sm" onClick={() => setQrEvent(e)}><QrCode size={13} /> QR</button>
                          <Link className="btn ghost sm" to="/organizer/attendees"><Users size={13} /> Attendees</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <aside className="org-side">
          <div className="side-card">
            <div className="k">Next payout</div>
            <div className="display" style={{ fontSize: 30, color: "var(--flame)", margin: "6px 0 2px" }}>{nextPayout ? cedi(nextPayout.payout) : "\u2014"}</div>
            <div className="sub" style={{ margin: 0 }}>{nextPayout ? `${nextPayout.event} · ${nextPayout.status}` : "Nothing pending"}</div>
            <Link className="btn ghost sm block" style={{ marginTop: 12 }} to="/organizer/settlements">View settlement history</Link>
          </div>
          <div className="side-card">
            <div className="k" style={{ marginBottom: 10 }}>Manage</div>
            <Link className="side-link" to="/organizer/discounts"><Tag size={16} /> Discount campaigns</Link>
            <Link className="side-link" to="/organizer/settlements"><Wallet size={16} /> Settlements</Link>
            <Link className="side-link" to="/organizer/staff"><UserCheck size={16} /> Gate staff</Link>
            <Link className="side-link" to="/scanner"><ScanLine size={16} /> Scan tickets</Link>
          </div>
        </aside>
      </div>

      {qrEvent && <EventQRModal ev={qrEvent} onClose={() => setQrEvent(null)} />}
    </div>
  );
}
