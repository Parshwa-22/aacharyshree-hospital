# Aacharyshree Hospital — Admin Panel (Stage 3)

A separate React app for managing everything the backend serves: Doctors,
Testimonials, Hero Slides, Donors, Rooms, and the navbar/footer tabs — with
drag-and-drop reordering and login via the backend's JWT auth.

## Setup
```bash
npm install
cp .env.example .env
# edit .env if your backend isn't on http://localhost:8080
npm run dev
```
Runs on `http://localhost:5174` by default. Make sure the backend
(`aacharyshree-hospital-backend.zip`) is running first, and that its
`app.cors.allowed-origins` includes `http://localhost:5174`.

## Creating your first login
The panel doesn't have a signup form on purpose (so a random visitor can't
just create themselves an admin account). Create your first admin with curl
using the `admin.registration.secret` from the backend's
`application.properties`:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@aacharyshree.com",
    "password": "a-strong-password-here",
    "registrationSecret": "CHANGE_ME_REGISTRATION_SECRET"
  }'
```
Then log in at `/login` in the panel with that username/password.

## What you can do here
- **Doctors / Testimonials / Hero Slides / Donors** — add, edit, delete,
  toggle visibility, and **drag to reorder** how they appear on the public
  site. Each form's image/video fields upload straight to the backend and
  fill in the URL for you.
- **Rooms** — same CRUD, plus a simple way to attach multiple photos and a
  comma-separated amenities list per room (no drag-reorder here, matching
  the original spec).
- **Navbar & Footer Tabs** — add a label + link, choose whether it shows in
  the navbar or the footer, drag to reorder, toggle it on/off. This is the
  dynamic nav-tabs manager you asked for — no code changes needed to add a
  new tab.

## How it's built
- `src/config/entityConfigs.js` — one place that describes each entity's
  fields. Add a field here and it shows up in the add/edit form automatically.
- `src/components/collection/CollectionManager.jsx` — the generic
  list + drag-reorder + CRUD UI, shared by Doctors/Testimonials/Hero/Donors/
  NavItems. Rooms has its own page (`src/pages/Rooms.jsx`) because it needs
  nested images/amenities instead of simple fields.
- `src/api/client.js` — axios instance that attaches the JWT to every
  request and bounces to `/login` on a 401.

## Still to come (Stage 4)
The **public hospital website** (the first zip) still uses hardcoded arrays
for doctors/testimonials/hero/departments/nav links — it isn't reading from
this backend yet. Stage 4 is rewiring that frontend to fetch from these same
APIs, so anything you change here shows up live on the real site.
