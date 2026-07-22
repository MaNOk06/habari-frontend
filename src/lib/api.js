// ---------------------------------------------------------------------------
// api.js — the single place the frontend talks to the backend.
// Change API_BASE if your backend runs somewhere else.
// ---------------------------------------------------------------------------
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api/v1";

import { prettyDate } from "./format.js";

// Turn a database event (snake_case, ISO dates, quantity/description) into the
// shape the UI components already expect (total/desc/time/date).
export function normalizeEvent(ev) {
  return {
    id: ev.id,
    title: ev.title,
    category: ev.category,
    iso: ev.date,
    date: prettyDate(ev.date),
    time: ev.start_time || "",
    venue: ev.venue,
    city: ev.city || "Accra",
    organizer: ev.organizer || "Habari organizer",
    organizerId: ev.organizer_id,
    blurb: ev.description || "",
    cardColor: ev.cardColor,
    thumbnail: ev.banner || undefined,
    status: ev.status,
    tickets: (ev.tickets || []).map((t) => ({
      id: t.id, name: t.name, price: t.price, total: t.quantity, sold: t.sold, desc: t.description || "",
    })),
  };
}

async function req(path, opts = {}) {
  const res = await fetch(API_BASE + path, { headers: { "Content-Type": "application/json" }, ...opts });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// ── Public (no login) ──
export async function fetchEvents() {
  const { events } = await req("/events");
  return events.map(normalizeEvent);
}
export async function fetchEvent(id) {
  const { event } = await req("/events/" + id);
  return normalizeEvent(event);
}
// Start an order: returns { order, paystack:{ authorization_url, reference } }
export function createOrder(eventId, items, buyer) {
  return req("/orders", {
    method: "POST",
    body: JSON.stringify({ eventId, items: items.map((i) => ({ ticketTypeId: i.id, qty: i.qty })), buyer }),
  });
}
// Confirm payment: returns the paid order with its issued, signed tickets.
export async function verifyOrder(reference) {
  const { order } = await req("/orders/verify", { method: "POST", body: JSON.stringify({ reference }) });
  return order;
}
