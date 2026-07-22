import { useState } from "react";
import { UserCheck, Plus, Trash2, ScanLine } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../../lib/store.jsx";

export default function GateStaff() {
  const { myEvents, staff, assignStaff, removeStaff } = useStore();
  const [f, setF] = useState({ name: "", email: "", event: myEvents[0]?.id || "" });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const valid = f.name.trim() && /\S+@\S+\.\S+/.test(f.email) && f.event;
  const add = () => {
    const ev = myEvents.find((e) => e.id === f.event);
    assignStaff({ name: f.name, email: f.email.toLowerCase(), eventId: f.event, eventTitle: ev?.title || "Event" });
    setF({ name: "", email: "", event: myEvents[0]?.id || "" });
  };

  return (
    <div className="wrap">
      <div className="page-head"><div><h1>Gate staff</h1><div className="sub">Assign people to scan tickets — for their event only</div></div></div>
      <div className="form-grid">
        <div className="tablecard">
          <div className="cap"><h3>Assigned staff</h3><Link className="btn ghost sm" to="/scanner"><ScanLine size={13} /> Open scanner</Link></div>
          {staff.length === 0 ? (
            <div className="empty" style={{ padding: "50px 20px" }}><UserCheck size={24} /><p>No staff assigned yet. Add someone on the right.</p></div>
          ) : (
            <table className="t">
              <thead><tr><th>Name</th><th>Email</th><th>Event</th><th></th></tr></thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td><td className="mono" style={{ fontSize: 13 }}>{s.email}</td>
                    <td><span className="pill grey">{s.eventTitle}</span></td>
                    <td><button className="iconbtn" onClick={() => removeStaff(s.id)} aria-label="Remove staff"><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <aside>
          <div className="panel">
            <h3><UserCheck size={16} style={{ verticalAlign: "-3px", color: "var(--flame)" }} /> Assign staff</h3>
            <p className="sub">They can only scan the event you pick here.</p>
            <div className="field"><label>Full name</label><input value={f.name} onChange={set("name")} placeholder="Kwesi Gate" /></div>
            <div className="field"><label>Email</label><input type="email" value={f.email} onChange={set("email")} placeholder="kwesi@example.com" /></div>
            <div className="field"><label>Event</label><select value={f.event} onChange={set("event")}>{myEvents.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}</select></div>
            <button className="btn flame block" style={{ marginTop: 16 }} disabled={!valid} onClick={add}><Plus size={15} /> Assign to event</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
