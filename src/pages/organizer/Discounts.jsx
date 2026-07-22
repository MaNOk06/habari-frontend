import { useState } from "react";
import { Tag, Plus, Trash2, Check } from "lucide-react";
import { useStore } from "../../lib/store.jsx";
import { cedi } from "../../lib/format.js";

export default function Discounts() {
  const { myEvents, discounts, addDiscount, removeDiscount } = useStore();
  const [f, setF] = useState({ name: "", code: "", type: "percent", value: "", event: "all", limit: "", expiry: "" });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const valid = f.name.trim() && f.code.trim() && f.value;
  const create = () => {
    addDiscount({ name: f.name, code: f.code.toUpperCase(), type: f.type, value: Number(f.value), event: f.event, limit: f.limit ? Number(f.limit) : null, expiry: f.expiry });
    setF({ name: "", code: "", type: "percent", value: "", event: "all", limit: "", expiry: "" });
  };
  const label = (d) => d.type === "percent" ? `${d.value}% off` : `${cedi(d.value)} off`;
  const eventName = (id) => id === "all" ? "All events" : (myEvents.find((e) => e.id === id)?.title || "Event");

  return (
    <div className="wrap">
      <div className="page-head"><div><h1>Discount campaigns</h1><div className="sub">Create promo codes for your events</div></div></div>
      <div className="form-grid">
        <div className="tablecard">
          <div className="cap"><h3>Active campaigns</h3></div>
          {discounts.length === 0 ? (
            <div className="empty" style={{ padding: "50px 20px" }}><Tag size={24} /><p>No campaigns yet. Create your first one on the right.</p></div>
          ) : (
            <table className="t">
              <thead><tr><th>Code</th><th>Discount</th><th>Applies to</th><th>Used</th><th>Expires</th><th></th></tr></thead>
              <tbody>
                {discounts.map((d) => (
                  <tr key={d.id}>
                    <td><span className="mono" style={{ fontWeight: 700 }}>{d.code}</span><div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{d.name}</div></td>
                    <td><span className="pill flame">{label(d)}</span></td>
                    <td>{eventName(d.event)}</td>
                    <td>{d.used || 0}{d.limit ? ` / ${d.limit}` : ""}</td>
                    <td>{d.expiry || "No expiry"}</td>
                    <td><button className="iconbtn" onClick={() => removeDiscount(d.id)} aria-label="Delete campaign"><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <aside>
          <div className="panel">
            <h3><Tag size={16} style={{ verticalAlign: "-3px", color: "var(--flame)" }} /> New campaign</h3>
            <div className="field"><label>Campaign name</label><input value={f.name} onChange={set("name")} placeholder="Early bird" /></div>
            <div className="field"><label>Promo code</label><input value={f.code} onChange={set("code")} placeholder="EARLY20" style={{ textTransform: "uppercase" }} /></div>
            <div className="row2">
              <div className="field"><label>Type</label><select value={f.type} onChange={set("type")}><option value="percent">Percentage</option><option value="fixed">Fixed (GH₵)</option></select></div>
              <div className="field"><label>{f.type === "percent" ? "Percent off" : "Amount off"}</label><input value={f.value} onChange={(e) => setF((s) => ({ ...s, value: e.target.value.replace(/\D/g, "") }))} placeholder={f.type === "percent" ? "20" : "50"} inputMode="numeric" /></div>
            </div>
            <div className="field"><label>Applies to</label><select value={f.event} onChange={set("event")}><option value="all">All my events</option>{myEvents.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}</select></div>
            <div className="row2">
              <div className="field"><label>Usage limit</label><input value={f.limit} onChange={(e) => setF((s) => ({ ...s, limit: e.target.value.replace(/\D/g, "") }))} placeholder="Unlimited" inputMode="numeric" /></div>
              <div className="field"><label>Expiry</label><input type="date" value={f.expiry} onChange={set("expiry")} /></div>
            </div>
            <button className="btn flame block" style={{ marginTop: 16 }} disabled={!valid} onClick={create}><Plus size={15} /> Create campaign</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
