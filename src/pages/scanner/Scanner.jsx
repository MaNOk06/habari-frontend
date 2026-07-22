import { useState } from "react";
import { Check, X, ScanLine, Wifi, WifiOff } from "lucide-react";
const OUTCOMES = [
  { valid: true, name: "Ama Mensah", type: "VIP", ref: "EGO-7QK2A1", msg: "Valid — welcome in" },
  { valid: true, name: "Kwame Owusu", type: "General", ref: "EGO-3MP9ZK", msg: "Valid — welcome in" },
  { valid: false, name: "Yaw Darko", type: "Table for 6", ref: "EGO-2WX7QP", msg: "Already checked in at 9:42 PM" },
  { valid: false, name: "Unknown", type: "—", ref: "EGO-000000", msg: "Invalid signature — ticket not recognised" },
];
export default function Scanner() {
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [checkedIn, setCheckedIn] = useState(342);
  const [online, setOnline] = useState(true);
  const scan = () => {
    setScanning(true); setResult(null);
    setTimeout(() => { const r = OUTCOMES[Math.floor(Math.random() * OUTCOMES.length)]; setResult(r); if (r.valid) setCheckedIn((n) => n + 1); setScanning(false); }, 900);
  };
  return (
    <div className="wrap scanner-wrap">
      <div className="page-head" style={{ marginBottom: 16 }}>
        <div><h1 style={{ fontSize: 30 }}>Check-in</h1><div className="sub">Detty December · Gate A</div></div>
        <button className="btn ghost sm" onClick={() => setOnline((o) => !o)}>{online ? <><Wifi size={14} /> Online</> : <><WifiOff size={14} /> Offline</>}</button>
      </div>
      <div className="stats" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="stat"><div className="k">Checked in</div><div className="v">{checkedIn}</div></div>
        <div className="stat"><div className="k">Mode</div><div className="v" style={{ fontSize: 22 }}>{online ? "Live sync" : "Cached"}</div></div>
      </div>
      <div className="scan-view" style={{ marginTop: 4 }}><div className="scan-frame" /><div className="scan-hint">{scanning ? "Reading QR…" : "Point camera at the ticket QR"}</div></div>
      <button className="btn flame block lg" style={{ marginTop: 16 }} onClick={scan} disabled={scanning}><ScanLine size={16} /> {scanning ? "Scanning…" : "Simulate scan"}</button>
      {result && (
        <div className={"scan-result " + (result.valid ? "valid" : "invalid")}>
          <div className="ic">{result.valid ? <Check size={22} /> : <X size={22} />}</div>
          <div><h4>{result.name} · {result.type}</h4><p>{result.msg}</p><p className="mono" style={{ fontSize: 11 }}>{result.ref}{!online && " · queued for sync"}</p></div>
        </div>
      )}
    </div>
  );
}
