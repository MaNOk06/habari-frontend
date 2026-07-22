import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Check, Upload, X, ImageIcon } from "lucide-react";
import { useStore } from "../../lib/store.jsx";
import { CATEGORIES, CARD_COLORS } from "../../data/mock.js";
import { Poster } from "../../components/Poster.jsx";
import { prettyDate } from "../../lib/format.js";

export default function CreateEvent() {
  const nav = useNavigate();
  const { id } = useParams();               // present => edit mode
  const { addEvent, updateEvent, getEvent } = useStore();
  const editing = getEvent(id);

  const [f, setF] = useState(() => editing
    ? { title: editing.title, category: editing.category, iso: editing.iso || "", time: editing.time || "", venue: editing.venue, city: editing.city || "Accra", blurb: editing.blurb || "" }
    : { title: "", category: "Nightlife", iso: "", time: "", venue: "", city: "Accra", blurb: "" });
  const [cardColor, setCardColor] = useState(editing?.cardColor || "");
  const [thumbnail, setThumbnail] = useState(editing?.thumbnail || "");
  const [tickets, setTickets] = useState(() => editing?.tickets?.length
    ? editing.tickets.map((t) => ({ id: t.id, name: t.name, price: String(t.price), total: String(t.total), sold: t.sold || 0, desc: t.desc || "" }))
    : [{ id: "t1", name: "General", price: "", total: "", sold: 0, desc: "" }]);
  const [saved, setSaved] = useState(false);
  const [imgError, setImgError] = useState("");

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const setT = (i, k, v) => setTickets((ts) => ts.map((t, j) => (j === i ? { ...t, [k]: v } : t)));
  const addTicket = () => setTickets((ts) => [...ts, { id: "t" + (ts.length + 1), name: "", price: "", total: "", sold: 0, desc: "" }]);
  const removeTicket = (i) => setTickets((ts) => ts.filter((_, j) => j !== i));

  const onThumb = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 600 * 1024) { setImgError("Image is over 600KB — pick a smaller one so it saves."); return; }
    setImgError("");
    const reader = new FileReader();
    reader.onload = () => setThumbnail(reader.result);
    reader.readAsDataURL(file);
  };

  const valid = f.title.trim() && f.iso && f.venue.trim() && tickets.every((t) => t.name && t.price && t.total);
  const preview = { title: f.title || "Your event", category: f.category, date: prettyDate(f.iso), time: f.time, venue: f.venue, city: f.city, cardColor, thumbnail };

  const submit = () => {
    const payload = {
      ...f,
      date: prettyDate(f.iso),
      cardColor: thumbnail ? cardColor : cardColor,
      thumbnail,
      tickets: tickets.map((t) => ({ id: t.id, name: t.name, price: Number(t.price), total: Number(t.total), sold: t.sold || 0, desc: t.desc || "" })),
    };
    if (editing) { updateEvent(id, payload); }
    else { addEvent(payload); }
    setSaved(true); setTimeout(() => nav("/organizer"), 800);
  };

  return (
    <div className="wrap">
      <div className="page-head"><div><h1>{editing ? "Edit event" : "Create event"}</h1><div className="sub">{editing ? "Changes save straight away" : "Goes live after admin approval (spec §3.2)"}</div></div></div>
      <div className="form-grid">
        <div>
          <div className="panel">
            <h3>Details</h3>
            <div className="field"><label>Event name</label><input value={f.title} onChange={set("title")} placeholder="Detty December" /></div>
            <div className="row2">
              <div className="field"><label>Category</label><select value={f.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
              <div className="field"><label>City</label><input value={f.city} onChange={set("city")} /></div>
            </div>
            <div className="row2">
              <div className="field"><label>Date</label><input type="date" value={f.iso} onChange={set("iso")} /></div>
              <div className="field"><label>Start time</label><input value={f.time} onChange={set("time")} placeholder="8:00 PM" /></div>
            </div>
            <div className="field"><label>Venue</label><input value={f.venue} onChange={set("venue")} placeholder="Coco Beach" /></div>
            <div className="field"><label>Description</label><textarea rows={3} value={f.blurb} onChange={set("blurb")} placeholder="Tell people what to expect" /></div>
          </div>

          <div className="panel">
            <h3><ImageIcon size={16} style={{ verticalAlign: "-3px", color: "var(--flame)" }} /> Event artwork</h3>
            <p className="sub">Upload a thumbnail, or skip it and pick a card colour below.</p>
            {thumbnail ? (
              <div className="thumb-set">
                <img src={thumbnail} alt="thumbnail" />
                <button className="btn ghost sm" onClick={() => setThumbnail("")}><X size={13} /> Remove image</button>
              </div>
            ) : (
              <label className="thumb-upload">
                <Upload size={18} /><span>Upload thumbnail</span>
                <input type="file" accept="image/*" onChange={onThumb} hidden />
              </label>
            )}
            {imgError && <p className="sub" style={{ color: "var(--flame)" }}>{imgError}</p>}

            <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", margin: "16px 0 8px" }}>Card colour</label>
            <div className="swatches">
              <button className={"swatch cat" + (cardColor === "" ? " on" : "")} onClick={() => setCardColor("")} title="Use category colour"><span style={{ fontSize: 10, fontWeight: 700 }}>Auto</span></button>
              {CARD_COLORS.map((c) => (
                <button key={c.hex} className={"swatch" + (cardColor === c.hex ? " on" : "")} style={{ background: c.hex }} onClick={() => setCardColor(c.hex)} title={c.name} aria-label={c.name}>
                  {cardColor === c.hex && <Check size={14} color="#fff" />}
                </button>
              ))}
            </div>
            {thumbnail && <p className="sub" style={{ marginTop: 10 }}>An uploaded image shows instead of the colour.</p>}
          </div>

          <div className="panel">
            <h3>Ticket types</h3>
            <p className="sub">Add as many tiers as you like — General, VIP, Early Bird…</p>
            <div className="ticket-editor">
              <div className="ted-row" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--ink-soft)" }}><span>Name</span><span>Price (GH₵)</span><span>Quantity</span><span /></div>
              {tickets.map((t, i) => (
                <div className="ted-row" key={i}>
                  <input value={t.name} onChange={(e) => setT(i, "name", e.target.value)} placeholder="VIP" />
                  <input value={t.price} onChange={(e) => setT(i, "price", e.target.value.replace(/\D/g, ""))} placeholder="350" inputMode="numeric" />
                  <input value={t.total} onChange={(e) => setT(i, "total", e.target.value.replace(/\D/g, ""))} placeholder="200" inputMode="numeric" />
                  <button className="iconbtn" onClick={() => removeTicket(i)} disabled={tickets.length === 1} aria-label="Remove ticket type"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
            <button className="btn ghost sm" style={{ marginTop: 12 }} onClick={addTicket}><Plus size={14} /> Add ticket type</button>
          </div>
        </div>

        <aside className="summary">
          <div style={{ maxWidth: 260 }}><Poster ev={preview} /></div>
          <p className="preview-note">Live preview — this is your event poster and public page header.</p>
          <button className="btn flame block lg" style={{ marginTop: 14 }} disabled={!valid || saved} onClick={submit}>
            {saved ? <><Check size={16} /> Saved</> : editing ? "Save changes" : "Submit for approval"}
          </button>
          {!valid && <p className="preview-note">Fill name, date, venue and complete ticket rows to continue.</p>}
        </aside>
      </div>
    </div>
  );
}
