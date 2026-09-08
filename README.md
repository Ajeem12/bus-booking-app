# Bus Booking Sheet — React + Node + Neon PostgreSQL

Full-stack app that lets you enter the bus booking fields (agent name, seat number,
name/village, boarding point, mobile number, deposit, balance) and print/PDF the
result in the exact same table layout as your original sheet — A4, portrait,
adjustable font size, and nothing gets cut off (long text wraps instead of clipping).

## Project structure

```
bus-booking-app/
  backend/     -> Express + PostgreSQL API
  frontend/    -> React (Vite) app
```

## 1. Backend setup + Neon database migrations

```bash
cd backend
npm install
copy .env.example .env      (Windows)   OR   cp .env.example .env   (Mac/Linux)
```

Create a project at [neon.tech](https://neon.tech), copy its pooled connection string,
and put it in `.env`:

```
DATABASE_URL=postgresql://user:password@host/bus_booking?sslmode=require
NODE_ENV=development
PORT=5000
```

Run the migrations. Neon already provides the database, so no local database
creation command or phpMyAdmin step is needed:

```bash
npm run setup
```

This runs `npm run migrate`, which creates the `trip_sheets` and `bookings` tables
in your Neon database.

If you ever need to undo the last migration: `npm run migrate:rollback`.
If you change a migration file later and want to re-apply it, just add a **new**
migration file rather than editing an old one (that's how migrations are meant to work).

Start the server:

```bash
npm run dev
```

It should print: `Server running on http://localhost:5000`

> `backend/schema.sql` is a PostgreSQL reference only. You normally do not need
> to run it manually because the migrations create the tables.

## 2. Frontend setup

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

It will start at `http://localhost:3000` — open that in your browser.

## 3. How to use

1. Click **"+ नई शीट"**, fill the top info (date, service name, vehicle number,
   helper, route, driver name) → **"जानकारी सेव करें"**.
2. Use **"नई एंट्री जोड़ें"** to add each passenger row (choose section: स्लीपर / सीट / केबिन
   — matches the 3 groups in your original sheet).
3. Edit or delete any row directly in the table below.
4. Click **"प्रिंट / PDF देखें"** — this opens the exact printable layout.
   - Use the font-size slider to make text bigger/smaller.
   - Click **"प्रिंट करें / PDF सेव करें"** → in the print dialog choose
     **Destination: Save as PDF** (or "Microsoft Print to PDF"), **Layout: Portrait**,
     **Paper size: A4**.
   - The table header repeats on every page and rows never break in half, so if you
     have a lot of entries it will simply flow onto a 2nd page instead of cutting
     anything off.

## Notes

- To reopen an old sheet later, use the "पुरानी शीट खोलें" dropdown at the top —
  everything is saved in Neon PostgreSQL, so it's there next time you open the app.
- If you want to change the section labels (स्लीपर/सीट/केबिन) or add more sections,
  edit the `sections` array in `frontend/src/components/BookingForm.jsx`,
  `BookingTable.jsx`, and `PrintSheet.jsx`.
