import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Users, ChevronLeft, Minus, Plus, Share2, Loader } from "lucide-react";
import { useStore } from "../../lib/store.jsx";
import { Poster } from "../../components/Poster.jsx";
import { cedi, remaining, availability } from "../../lib/format.js";
import { fetchEvent } from "../../lib/api.js";

export default function EventDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { getEvent } = useStore();
  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState({});

  useEffect(() => {
    let alive = true;
    fetchEvent(id)
      .catch(() => getEvent(id))          // fall back to a locally-created/sample event
      .then((found) => { if (!alive) return; setEv(found || null); if (found) setQty(Object.fromEntries(found.tickets.map((t) => [t.id, 0]))); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  if (loading) return <div className="wrap empty"><Loader size={24} className="spin" /><p>Loading event…</p></div>;
  if (!ev) return <div className="wrap empty"><p>That event doesn't exist.</p><Link className="btn" to="/">Back to events</Link></div>;

  const change = (t, d) => setQty((s) => { const next = Math.max(0, Math.min(remaining(t), (s[t.id] || 0) + d)); return { ...s, [t.id]: next }; });
  const items = ev.tickets.map((t) => ({ ...t, qty: qty[t.id] || 0 })).filter((t) => t.qty > 0);
  const total = items.reduce((s, t) => s + t.price * t.qty, 0);
  const count = items.reduce((s, t) => s + t.qty, 0);

  return (
    <div className="wrap">
      <button className="link-back" onClick={() => nav("/")}><ChevronLeft size={16} /> All events</button>
      <div className="ev-hero">
        <div><Poster ev={ev} /></div>
        <div className="ev-headline">
          <span className="eyebrow cat">{ev.category}</span>
          <h1>{ev.title}</h1>
          <div className="ev-org"><Users size={14} style={{ verticalAlign: "-2px" }} /> by {ev.organizer}</div>
          <div className="ev-facts">
            <div className="f"><CalendarDays size={18} /><div><b>{ev.date}</b><span>Date</span></div></div>
            <div className="f"><Clock size={18} /><div><b>{ev.time || "TBA"}</b><span>Start time</span></div></div>
            <div className="f"><MapPin size={18} /><div><b>{ev.venue}</b><span>{ev.city}</span></div></div>
          </div>
          <button className="btn ghost sm"><Share2 size={14} /> Share event</button>
        </div>
      </div>
      <div className="ev-body">
        <div className="prose"><h3>About</h3><p>{ev.blurb}</p></div>
        <aside className="buybox">
          <h3>Tickets</h3>
          {ev.tickets.map((t) => {
            const a = availability(t); const out = remaining(t) <= 0;
            return (
              <div key={t.id} className={"tt" + (out ? " out" : "")}>
                <div>
                  <div className="name">{t.name} <span className={"avail " + a.cls}>· {a.label}</span></div>
                  <div className="desc">{t.desc}</div><div className="price">{cedi(t.price)}</div>
                </div>
                <div className="stepper">
                  <button onClick={() => change(t, -1)} disabled={out || (qty[t.id] || 0) === 0} aria-label={`Remove ${t.name}`}><Minus size={15} /></button>
                  <span>{qty[t.id] || 0}</span>
                  <button onClick={() => change(t, 1)} disabled={out || (qty[t.id] || 0) >= remaining(t)} aria-label={`Add ${t.name}`}><Plus size={15} /></button>
                </div>
              </div>
            );
          })}
          <div className="buy-total"><span>{count} ticket{count === 1 ? "" : "s"}</span><span className="n">{cedi(total)}</span></div>
          <button className="btn flame block lg" disabled={count === 0} onClick={() => nav("/checkout", { state: { event: ev, items, total } })}>{count === 0 ? "Select tickets" : "Get tickets"}</button>
        </aside>
      </div>
    </div>
  );
}
