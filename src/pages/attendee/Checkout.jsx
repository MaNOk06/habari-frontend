import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Smartphone, CreditCard, Check, AlertCircle } from "lucide-react";
import { CATEGORY_COLOR } from "../../data/mock.js";
import { cedi } from "../../lib/format.js";
import { createOrder, verifyOrder } from "../../lib/api.js";

const NETWORKS = [ { id: "mtn", label: "MTN MoMo", tint: "#ffcc00" }, { id: "telecel", label: "Telecel Cash", tint: "#e2001a" }, { id: "at", label: "AirtelTigo Money", tint: "#00a2e0" } ];

export default function Checkout() {
  const { state } = useLocation();
  const nav = useNavigate();
  const [method, setMethod] = useState("mtn");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!state?.event) return <Navigate to="/" replace />;
  const { event: ev, items, total } = state;
  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim().length >= 9;

  const pay = async () => {
    setBusy(true); setError("");
    try {
      // 1. Create the order in the database (returns a Paystack checkout URL).
      const { paystack } = await createOrder(ev.id, items, { name: form.name, email: form.email, phone: form.phone });
      // 2. Real Paystack would redirect to paystack.authorization_url here.
      //    We simulate a successful payment and verify it, which issues the tickets.
      const order = await verifyOrder(paystack.reference);
      nav("/confirmation", { state: { event: ev, order } });
    } catch (e) {
      setError(e.message.includes("fetch") ? "Couldn't reach the server — is the backend running on port 4000?" : e.message);
      setBusy(false);
    }
  };

  return (
    <div className="wrap" style={{ maxWidth: 860, margin: "0 auto" }}>
      <button className="link-back" onClick={() => nav(-1)}><ChevronLeft size={16} /> Back to event</button>
      <h1 className="display" style={{ fontSize: 36, margin: "6px 0 22px" }}>Checkout</h1>
      <div className="co">
        <div>
          <div className="panel">
            <h3><ShieldCheck size={16} /> No account needed</h3>
            <p className="sub">Your tickets go straight to your email. We just need where to send them.</p>
            <div className="field"><label>Full name</label><input value={form.name} onChange={set("name")} placeholder="Ama Mensah" /></div>
            <div className="row2">
              <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set("email")} placeholder="ama@example.com" /></div>
              <div className="field"><label>Phone (MoMo)</label><input type="tel" value={form.phone} onChange={set("phone")} placeholder="024 123 4567" /></div>
            </div>
          </div>
          <div className="panel">
            <h3><Smartphone size={16} /> Pay with</h3>
            <p className="sub">Mobile money is instant. Cards work too.</p>
            {NETWORKS.map((nw) => (
              <button key={nw.id} className={"pm" + (method === nw.id ? " on" : "")} onClick={() => setMethod(nw.id)}><span className="dot" style={{ background: nw.tint }} />{nw.label}{method === nw.id && <Check size={16} className="ck" />}</button>
            ))}
            <button className={"pm" + (method === "card" ? " on" : "")} onClick={() => setMethod("card")}><CreditCard size={16} /> Debit / credit card{method === "card" && <Check size={16} className="ck" />}</button>
            <p className="sub" style={{ margin: "12px 0 0" }}>You confirm payment securely on Paystack. We never see or store your card or PIN.</p>
          </div>
        </div>
        <aside className="summary">
          <div className="stub">
            <div className="stub-top" style={{ background: CATEGORY_COLOR[ev.category] }}>{ev.title}</div>
            <div className="stub-perf"><i /><i /></div>
            <div className="stub-body">
              <div className="stub-meta">{ev.date} · {ev.venue}</div>
              {items.map((t) => <div key={t.id} className="stub-row"><span>{t.qty} × {t.name}</span><span>{cedi(t.price * t.qty)}</span></div>)}
              <div className="stub-tot"><span>Total</span><span className="n">{cedi(total)}</span></div>
            </div>
          </div>
          <button className="btn flame block lg" style={{ marginTop: 16 }} disabled={!valid || busy} onClick={pay}>{busy ? "Contacting Paystack…" : `Pay ${cedi(total)}`}</button>
          {error && <div className="notice err" style={{ marginTop: 12 }}><AlertCircle size={15} /> {error}</div>}
          {!valid && !error && <p className="sub" style={{ textAlign: "center", marginTop: 10 }}>Add your name, a valid email and phone to continue.</p>}
        </aside>
      </div>
    </div>
  );
}
