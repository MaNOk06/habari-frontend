// MOCK DATA — stands in for the backend database (spec section 12).
export const CATEGORY_COLOR = {
  Nightlife: "#8A3B5C", Concert: "#2F6B5E", Tech: "#3B5BA5",
  Community: "#C4701D", Arts: "#7C4A93", Business: "#3A3630",
};
export const CATEGORIES = Object.keys(CATEGORY_COLOR);

// Expanded palette an organizer can pick from for their event card.
export const CARD_COLORS = [
  { name: "Wine", hex: "#7A1F2B" }, { name: "Pine", hex: "#14514A" },
  { name: "Cobalt", hex: "#21329C" }, { name: "Rust", hex: "#B4610E" },
  { name: "Plum", hex: "#4E2560" }, { name: "Ink", hex: "#26241C" },
  { name: "Clay", hex: "#9B3B2E" }, { name: "Forest", hex: "#2F5233" },
  { name: "Denim", hex: "#2B4C7E" }, { name: "Mustard", hex: "#B8860B" },
  { name: "Berry", hex: "#8E2C5B" }, { name: "Slate", hex: "#3A4750" },
  { name: "Teal", hex: "#0E6B63" }, { name: "Ember", hex: "#B23A17" },
];

// Every event carries an ISO date so we can sort upcoming vs past.
export const EVENTS = [
  { id: "evt_detty", iso: "2026-12-27", title: "Detty December", category: "Nightlife", date: "Sat, 27 Dec 2026", time: "8:00 PM", venue: "Coco Beach", city: "Accra", organizer: "Nights Collective", organizerId: "org_nights",
    blurb: "The city's biggest open-air December party. Two stages, a live band, and headline sets until sunrise.",
    tickets: [ { id: "t1", name: "General", price: 120, total: 800, sold: 512, desc: "Entry + main stage access" }, { id: "t2", name: "VIP", price: 350, total: 200, sold: 173, desc: "Fast lane, raised deck, 2 drinks" }, { id: "t3", name: "Table for 6", price: 2000, total: 30, sold: 21, desc: "Reserved table + bottle service" } ] },
  { id: "evt_alte", iso: "2026-07-31", title: "Alté Wave Live", category: "Concert", date: "Fri, 31 Jul 2026", time: "7:00 PM", venue: "Bloombar", city: "Accra", organizer: "Nights Collective", organizerId: "org_nights",
    blurb: "An intimate live showcase of Ghana's alté and neo-soul scene. Small room, big voices.",
    tickets: [ { id: "t1", name: "Standing", price: 100, total: 200, sold: 88, desc: "General standing area" }, { id: "t2", name: "Front Row", price: 220, total: 40, sold: 12, desc: "Reserved, closest to stage" } ] },
  { id: "evt_easter", iso: "2026-04-05", title: "Easter Block Party", category: "Nightlife", date: "Sun, 5 Apr 2026", time: "2:00 PM", venue: "Osu Oxford St", city: "Accra", organizer: "Nights Collective", organizerId: "org_nights",
    blurb: "A daytime street party that ran through Easter Sunday. Sold out at the gate.",
    tickets: [ { id: "t1", name: "General", price: 80, total: 500, sold: 500, desc: "Full event access" } ] },
  { id: "evt_warmup", iso: "2026-05-10", title: "Afro Nation Warmup", category: "Concert", date: "Sun, 10 May 2026", time: "6:00 PM", venue: "Untamed Empire", city: "Accra", organizer: "Nights Collective", organizerId: "org_nights",
    blurb: "The official warmup night before the big festival weekend.",
    tickets: [ { id: "t1", name: "Standard", price: 150, total: 400, sold: 356, desc: "Entry" }, { id: "t2", name: "VIP", price: 400, total: 60, sold: 60, desc: "VIP lounge" } ] },
  { id: "evt_pycon", iso: "2026-08-20", title: "PyCon Ghana", category: "Tech", date: "Thu, 20 Aug 2026", time: "9:00 AM", venue: "Accra Digital Centre", city: "Accra", organizer: "PyCon Ghana", organizerId: "org_pycon",
    blurb: "Three days of talks, workshops, and hallway conversations with the Python community.",
    tickets: [ { id: "t1", name: "Student", price: 80, total: 300, sold: 244, desc: "Student ID required" }, { id: "t2", name: "Regular", price: 200, total: 500, sold: 310, desc: "Full 3-day access" } ] },
  { id: "evt_brunch", iso: "2026-08-29", title: "The Girls' Brunch", category: "Community", date: "Sun, 29 Aug 2026", time: "12:00 PM", venue: "Kempinski Gold Coast", city: "Accra", organizer: "Sisterhood GH", organizerId: "org_sis",
    blurb: "An afternoon of good food, live acoustic sets, and a marketplace of women-owned brands.",
    tickets: [ { id: "t1", name: "Single", price: 150, total: 250, sold: 198, desc: "One seat + welcome drink" }, { id: "t2", name: "Duo", price: 270, total: 80, sold: 61, desc: "Two seats, save GH30" } ] },
];

export const ORGANIZERS = [
  { id: "org_nights", name: "Nights Collective", contact: "kojo@nights.gh", status: "Approved", bank: "GCB Bank", events: 4 },
  { id: "org_pycon", name: "PyCon Ghana", contact: "team@pycon.gh", status: "Approved", bank: "Fidelity Bank", events: 1 },
  { id: "org_sis", name: "Sisterhood GH", contact: "hello@sisterhood.gh", status: "Approved", bank: "Absa", events: 2 },
  { id: "org_afro", name: "Afropole Curators", contact: "amma@afropole.gh", status: "Pending", bank: "Stanbic", events: 0 },
];
export const ORDERS = [
  { ref: "EGO-7QK2A1", buyer: "Ama Mensah", email: "ama@example.com", type: "VIP", qty: 2, amount: 700, status: "Checked in" },
  { ref: "EGO-3MP9ZK", buyer: "Kwame Owusu", email: "kwame@example.com", type: "General", qty: 1, amount: 120, status: "Valid" },
  { ref: "EGO-8LD4RT", buyer: "Efua Boateng", email: "efua@example.com", type: "General", qty: 4, amount: 480, status: "Valid" },
  { ref: "EGO-2WX7QP", buyer: "Yaw Darko", email: "yaw@example.com", type: "Table for 6", qty: 1, amount: 2000, status: "Checked in" },
];

// Settlement history for the signed-in organizer (Nights Collective).
export const ORG_SETTLEMENTS = [
  { id: "s_detty", event: "Detty December", date: "Pending event", gross: 96040, fees: 1824, payout: 94216, status: "Pending" },
  { id: "s_alte", event: "Alté Wave Live", date: "Awaiting event", gross: 11440, fees: 217, payout: 11223, status: "Pending" },
  { id: "s_warmup", event: "Afro Nation Warmup", date: "14 May 2026", gross: 77400, fees: 1470, payout: 75930, status: "Paid" },
  { id: "s_easter", event: "Easter Block Party", date: "9 Apr 2026", gross: 40000, fees: 760, payout: 39240, status: "Paid" },
];

export const SALES_7D = [ { d: "Mon", v: 42 }, { d: "Tue", v: 61 }, { d: "Wed", v: 38 }, { d: "Thu", v: 88 }, { d: "Fri", v: 120 }, { d: "Sat", v: 156 }, { d: "Sun", v: 74 } ];

// Admin-side settlements (kept for the admin dashboard).
export const SETTLEMENTS = [
  { id: "s1", event: "Detty December", organizer: "Nights Collective", gross: 96040, fees: 1824, payout: 94216, status: "Processing" },
  { id: "s2", event: "PyCon Ghana", organizer: "PyCon Ghana", gross: 81520, fees: 1549, payout: 79971, status: "Paid" },
  { id: "s3", event: "The Girls' Brunch", organizer: "Sisterhood GH", gross: 46170, fees: 877, payout: 45293, status: "Pending" },
];
