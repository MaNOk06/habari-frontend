import { Link } from "react-router-dom";
import { CATEGORY_COLOR } from "../data/mock.js";
import { cedi, lowestPrice } from "../lib/format.js";

// The event card. Uses an uploaded thumbnail if there is one, otherwise a flat
// colour block (the organizer's chosen colour, or the category default).
export function Poster({ ev, showFoot = true }) {
  const bg = ev.cardColor || CATEGORY_COLOR[ev.category] || "#26241C";
  const hasImg = !!ev.thumbnail;
  return (
    <div className="poster" style={hasImg ? { background: "#111" } : { background: bg }}>
      {hasImg && <img className="poster-img" src={ev.thumbnail} alt="" />}
      <span className="poster-tag">{ev.category}</span>
      <div className="poster-title">{ev.title}</div>
      {showFoot && <div className="poster-foot"><span>{ev.date}</span><span>{ev.city}</span></div>}
    </div>
  );
}
export function EventCard({ ev }) {
  return (
    <Link to={`/events/${ev.id}`} className="evcard">
      <Poster ev={ev} />
      <div className="evcard-meta">
        <div className="t">{ev.title}</div>
        <div className="d">{ev.venue} · {ev.time}</div>
        <div className="p">from {cedi(lowestPrice(ev))}</div>
      </div>
    </Link>
  );
}
