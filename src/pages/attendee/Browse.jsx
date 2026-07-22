import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Ticket, ChevronDown, Smartphone, Zap, UserX, Wallet, Loader } from "lucide-react";
import { EVENTS as MOCK_EVENTS, CATEGORIES } from "../../data/mock.js";
import { EventCard } from "../../components/Poster.jsx";
import HeroArt from "../../components/HeroArt.jsx";
import { fetchEvents } from "../../lib/api.js";

const STATS = [
  { icon: Smartphone, h: "MoMo-first", p: "Pay with MTN, Telecel & AirtelTigo." },
  { icon: Zap, h: "Instant tickets", p: "QR sent to your email in seconds." },
  { icon: UserX, h: "No account needed", p: "Buy in under a minute." },
  { icon: Wallet, h: "Fair settlement", p: "Organizers paid out fast." },
];

export default function Browse() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    fetchEvents()
      .then((live) => { if (alive) { setEvents(live); setOffline(false); } })
      .catch(() => { if (alive) { setEvents(MOCK_EVENTS); setOffline(true); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const list = useMemo(() => events.filter((e) => (cat === "All" || e.category === cat) && (q === "" || e.title.toLowerCase().includes(q.toLowerCase()) || e.venue.toLowerCase().includes(q.toLowerCase()))), [events, cat, q]);

  return (
    <>
      <section className="takeover">
        <div className="wrap takeover-inner">
          <div className="takeover-copy">
            <span className="eyebrow tk-kicker">Live in Accra · this season</span>
            <h1>Nights worth <span className="hl">remembering</span>.</h1>
            <p>Real tickets for Ghana's best events. No account needed — pay with mobile money and get your QR by email in seconds.</p>
            <div className="hero-actions">
              <a className="btn flame lg" href="#events">Get tickets now <ArrowRight size={16} /></a>
              <Link className="btn ghost lg" to="/organizer">Sell tickets with us</Link>
            </div>
          </div>
          <div className="takeover-art"><HeroArt /></div>
        </div>
        <div className="wrap takeover-stats">
          {STATS.map((s) => (
            <div className="tk-stat" key={s.h}><div className="tk-stat-h"><s.icon size={15} /> {s.h}</div><p>{s.p}</p></div>
          ))}
        </div>
        <a className="scroll-cue" href="#events">Scroll to browse events <ChevronDown size={15} /></a>
      </section>

      <div className="wrap events-section" id="events">
        <div className="section-head"><h2>Upcoming events</h2></div>
        {offline && <div className="notice">Showing sample events — start the backend (port 4000) to load live events from the database.</div>}
        <div className="controls"><div className="search"><Search size={17} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events or venues" aria-label="Search events" /></div></div>
        <div className="filters">{["All", ...CATEGORIES].map((c) => <button key={c} className={"filt" + (c === cat ? " on" : "")} onClick={() => setCat(c)}>{c}</button>)}</div>
        {loading ? (
          <div className="empty"><Loader size={24} className="spin" /><p>Loading events…</p></div>
        ) : list.length === 0 ? (
          <div className="empty"><Ticket size={26} /><p>Nothing here yet. Try another category or clear your search.</p></div>
        ) : (
          <div className="evgrid" style={{ marginTop: 24 }}>{list.map((ev) => <EventCard key={ev.id} ev={ev} />)}</div>
        )}
      </div>
    </>
  );
}
