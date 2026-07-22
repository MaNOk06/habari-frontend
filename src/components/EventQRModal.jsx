import { X, Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import QRCodeSvg from "./QRCode.jsx";

// Each event gets its own QR (spec 3.4). Scanning it opens the event's public
// page. Here the link points at this app's own event route.
export default function EventQRModal({ ev, onClose }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/events/${ev.id}`;

  const copy = () => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const download = () => {
    const svg = document.getElementById("event-qr-svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${ev.title.replace(/\s+/g, "-").toLowerCase()}-qr.svg`; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="display" style={{ fontSize: 22 }}>Event QR</h3>
          <button className="iconbtn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <p className="sub" style={{ marginTop: 0 }}>Print this on flyers or share it — scanning opens the public page for <b>{ev.title}</b>.</p>
        <div className="qr-frame"><QRCodeSvg id="event-qr-svg" seed={"event-" + ev.id} size={190} /></div>
        <div className="qr-url mono">{url}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="btn ghost block" onClick={copy}>{copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy link</>}</button>
          <button className="btn block" onClick={download}><Download size={15} /> Download</button>
        </div>
      </div>
    </div>
  );
}
