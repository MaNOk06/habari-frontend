import { Wallet, Download } from "lucide-react";
import { ORG_SETTLEMENTS } from "../../data/mock.js";
import { cedi } from "../../lib/format.js";

export default function Settlements() {
  const paid = ORG_SETTLEMENTS.filter((s) => s.status === "Paid").reduce((a, s) => a + s.payout, 0);
  const pending = ORG_SETTLEMENTS.filter((s) => s.status !== "Paid").reduce((a, s) => a + s.payout, 0);
  const pill = (s) => s === "Paid" ? "green" : s === "Processing" ? "flame" : "amber";

  return (
    <div className="wrap">
      <div className="page-head"><div><h1>Settlement history</h1><div className="sub">Platform-managed payouts to your bank</div></div></div>
      <div className="stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="stat"><div className="k">Total paid out</div><div className="v">{cedi(paid)}</div></div>
        <div className="stat"><div className="k">Pending</div><div className="v flame">{cedi(pending)}</div></div>
        <div className="stat"><div className="k">Payout account</div><div className="v" style={{ fontSize: 20 }}>GCB ••• 0300</div></div>
      </div>
      <div className="tablecard">
        <div className="cap"><h3><Wallet size={16} style={{ verticalAlign: "-3px" }} /> All settlements</h3></div>
        <table className="t">
          <thead><tr><th>Event</th><th>Date</th><th>Gross</th><th>Platform fee</th><th>Payout</th><th>Status</th></tr></thead>
          <tbody>
            {ORG_SETTLEMENTS.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.event}</td><td>{s.date}</td><td>{cedi(s.gross)}</td><td>{cedi(s.fees)}</td>
                <td style={{ fontWeight: 700 }}>{cedi(s.payout)}</td><td><span className={"pill " + pill(s.status)}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="sub" style={{ marginTop: 14 }}>Payouts are calculated as gross sales minus the platform fee, then transferred to your connected bank (spec §5 · Paystack Transfer API).</p>
    </div>
  );
}
