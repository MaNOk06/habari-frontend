# Habari — Frontend

The website people look at. Built with React + Vite. This is one of **two**
projects — the other is `habari-backend` (the API). Keep them in **separate
folders**; they run at the same time on different ports.

---

## 0. Before anything — the mental model (read this once)

You are running **two programs**:

```
habari-frontend   →  the website        →  http://localhost:5173   (you LOOK at this)
habari-backend    →  the API / database →  http://localhost:4000   (data lives here)
```

They live in different folders and run in **different terminal windows** at the
same time. Closing a terminal stops that program. This frontend currently uses
built-in sample data, so you can run it **on its own** — you don't need the
backend running just to see the site. (Connecting the two is the next step.)

---

## 1. Install Node.js (one time)

1. Go to https://nodejs.org and download the **LTS** version.
2. Install it (click through the installer).
3. Open a fresh terminal and check it worked:
   ```
   node -v
   ```
   You should see a version number (e.g. `v22.x` or `v24.x`). If you get
   "command not found", close and reopen the terminal, or restart your computer.

---

## 2. Run the frontend

Open a terminal **inside this folder** (the one containing `package.json`):

```
cd path/to/habari-frontend
npm install
npm run dev
```

- `npm install` downloads the libraries (React, the router, icons). Do this once.
  It creates a `node_modules` folder — that's normal, never edit it.
- `npm run dev` starts the live dev server. It prints something like:
  ```
  ➜  Local:   http://localhost:5173/
  ```
- Open that address in your browser. Every time you save a file, the page
  refreshes itself.

To stop the server: click the terminal and press **Ctrl + C**.

---

## 3. What you can click

There's a **"View as"** dropdown at the top-right that switches between the four
roles so you can see every screen:

- **Attendee** — browse events → open an event → pick tickets → checkout →
  get QR tickets
- **Organizer** — sales dashboard, create an event (with a live poster
  preview), attendee list + CSV export
- **Admin** — revenue overview, approve/reject organizers, release settlements
- **Gate scanner** — simulated ticket check-in with valid/used/invalid results

> The dropdown is a **demo shortcut**. In the real product these are separate
> areas you can only reach by logging in with the right kind of account — that
> lives in the backend, and wiring it up is the next step.

---

## 4. Project map — where things live

```
habari-frontend/
├─ index.html            the single HTML page everything loads into
├─ package.json          project name + libraries + the dev/build commands
├─ vite.config.js        build tool config (you won't need to touch this)
└─ src/
   ├─ main.jsx           the entry point — boots React and the router
   ├─ App.jsx            the list of routes (which URL shows which page)
   ├─ index.css          THE WHOLE LOOK — colors, fonts, every component style
   ├─ data/
   │  └─ mock.js         sample events/orders (this is fake "database" data)
   ├─ lib/
   │  ├─ format.js       money + availability helpers
   │  └─ store.jsx       remembers events an organizer creates (localStorage)
   ├─ components/
   │  ├─ Nav.jsx         top bar + the "View as" role switcher
   │  ├─ Poster.jsx      the flat gig-poster event card
   │  └─ QRCode.jsx      the ticket QR (a placeholder pattern for now)
   └─ pages/
      ├─ attendee/       Browse, EventDetail, Checkout, Confirmation
      ├─ organizer/      Dashboard, CreateEvent, Attendees
      ├─ admin/          Dashboard
      └─ scanner/        Scanner
```

**The one idea to hold on to:** the screen you see is decided by two things —
the current URL (handled in `App.jsx`) and the current data/state. Change the
data, and React re-draws the screen for you.

---

## 5. Changing the look

All colors and fonts are CSS variables at the very top of `src/index.css`, in
the `:root { ... }` block. For example:

```css
--flame: #E8481F;   /* the orange accent — change this and it updates everywhere */
--ink:   #17150F;   /* near-black text + buttons */
--bone:  #ECE3D1;   /* the warm paper background */
```

Change one value, save, and the whole app re-themes instantly.

The design is a deliberate **editorial gig-poster** style: flat colour blocks
(no gradients), big condensed type, black buttons, warm paper. That's what makes
it not look like a generic template.

---

## 6. Common problems & fixes

| What you see | What it means | Fix |
|---|---|---|
| `command not found: npm` | Node isn't installed / terminal is stale | Install Node (step 1), reopen terminal |
| `Failed to resolve import "..."` | A library isn't installed | Run `npm install` inside this folder |
| Blank white page | A code error | Look at the terminal AND the browser console (F12) for the red message; paste it to get help |
| `Port 5173 is in use` | Another copy is already running | Vite will offer another port — just use the new URL it prints |
| Page won't load at all | The dev server isn't running | Make sure `npm run dev` is still running in its terminal |

Golden rule: run every `npm` command **inside this `habari-frontend` folder** —
not in the backend folder, not in the parent folder.

---

## 7. What's next

Right now the site reads from `src/data/mock.js`. The next step is to connect it
to the `habari-backend` API so it shows **real** data and the "View as" dropdown
becomes a real **login**. When we do that, `mock.js` gets replaced by `fetch`
calls to `http://localhost:4000`.
