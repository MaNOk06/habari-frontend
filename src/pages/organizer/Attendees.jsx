import { useState } from "react";
import { Search, Download } from "lucide-react";
import { ORDERS } from "../../data/mock.js";
import { cedi } from "../../lib/format.js";
export default function Attendees() {
  const [q, setQ] = useState("");
  const rows = ORDERS.filter((o) => q === "" || o.buyer.toLowerCase().includes(q.toLowerCase()) || o.ref.toLowerCase().includes(q.toLowerCase()));
  const exportCsv = () => {
    const head = ["Reference", "Name", "Email", "Ticket", "Qty", "Amount", "Status"];
    const lines = ORDERS.map((o) => [o.ref, o.buyer, o.email, o.type, o.qty, o.amount, o.status]);
    const csv = [head, ...lines].map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "attendees.csv"; a.click(); URL.revokeObjectURL(url);
  };
  return (
    <div className="wrap">
      <div className="page-head"><div><h1>Attendees</h1><div className="sub">Detty December · {ORDERS.length} orders</div></div><button className="btn" onClick={exportCsv}><Download size={16} /> Export CSV</button></div>
      <div className="search" style={{ maxWidth: 340, marginBottom: 18 }}><Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or reference" aria-label="Search attendees" /></div>
      <div className="tablecard">
        <table className="t">
          <thead><tr><th>Reference</th><th>Name</th><th>Ticket</th><th>Qty</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>{rows.map((o) => <tr key={o.ref}><td className="mono" style={{ fontSize: 12 }}>{o.ref}</td><td style={{ fontWeight: 600 }}>{o.buyer}</td><td>{o.type}</td><td>{o.qty}</td><td>{cedi(o.amount)}</td><td><span className={"pill " + (o.status === "Checked in" ? "green" : "grey")}>{o.status}</span></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
