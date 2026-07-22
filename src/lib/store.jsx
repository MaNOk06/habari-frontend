import { createContext, useContext, useState, useCallback } from "react";
import { EVENTS } from "../data/mock.js";

// localStorage keys — each kind of data gets its own bucket.
const EVENTS_KEY = "habari_events";
const DISC_KEY = "habari_discounts";
const STAFF_KEY = "habari_staff";
const Ctx = createContext(null);

const load = (k, fallback) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fallback; } catch { return fallback; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function StoreProvider({ children }) {
  const [created, setCreated] = useState(() => load(EVENTS_KEY, []));
  const [discounts, setDiscounts] = useState(() => load(DISC_KEY, []));
  const [staff, setStaff] = useState(() => load(STAFF_KEY, []));

  const addEvent = useCallback((ev) => {
    setCreated((prev) => {
      const next = [{ ...ev, id: "evt_" + Date.now(), organizer: "Nights Collective", organizerId: "org_nights", createdByMe: true, status: ev.status || "Pending Approval" }, ...prev];
      save(EVENTS_KEY, next); return next;
    });
  }, []);

  const updateEvent = useCallback((id, patch) => {
    setCreated((prev) => {
      // Only events created in this browser can be edited (the seeded demo
      // events are read-only here — they'd be edited via the API in production).
      const next = prev.map((e) => (e.id === id ? { ...e, ...patch } : e));
      save(EVENTS_KEY, next); return next;
    });
  }, []);

  const addDiscount = useCallback((d) => {
    setDiscounts((prev) => { const next = [{ ...d, id: "disc_" + Date.now(), used: 0 }, ...prev]; save(DISC_KEY, next); return next; });
  }, []);
  const removeDiscount = useCallback((id) => {
    setDiscounts((prev) => { const next = prev.filter((d) => d.id !== id); save(DISC_KEY, next); return next; });
  }, []);

  const assignStaff = useCallback((s) => {
    setStaff((prev) => { const next = [{ ...s, id: "gs_" + Date.now() }, ...prev]; save(STAFF_KEY, next); return next; });
  }, []);
  const removeStaff = useCallback((id) => {
    setStaff((prev) => { const next = prev.filter((s) => s.id !== id); save(STAFF_KEY, next); return next; });
  }, []);

  const events = [...created, ...EVENTS];
  const getEvent = (id) => events.find((e) => e.id === id);
  const canEdit = (id) => created.some((e) => e.id === id);
  // "My events" = the signed-in organizer's (demo = Nights Collective + anything I create here)
  const myEvents = events.filter((e) => e.createdByMe || e.organizerId === "org_nights");

  const value = { events, myEvents, getEvent, canEdit, addEvent, updateEvent, discounts, addDiscount, removeDiscount, staff, assignStaff, removeStaff };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx);
