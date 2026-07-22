export const cedi = (n) => "GH\u20b5" + Number(n).toLocaleString("en-GH");
export const remaining = (t) => t.total - t.sold;
export const lowestPrice = (ev) => Math.min(...ev.tickets.map((t) => t.price));
export function availability(t) {
  const left = remaining(t);
  if (left <= 0) return { label: "Sold out", cls: "no" };
  if (left <= 20) return { label: `Only ${left} left`, cls: "low" };
  return { label: `${left} available`, cls: "ok" };
}
export const makeRef = () => "EGO-" + Math.random().toString(36).slice(2, 8).toUpperCase();

// Is the event in the future? (used to split upcoming vs past)
export const isUpcoming = (ev) => !ev.iso || new Date(ev.iso) >= new Date(new Date().toDateString());
// Turn an ISO date (2026-12-27) into "Sat, 27 Dec 2026" for display.
export function prettyDate(iso) {
  if (!iso) return "Date TBC";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
