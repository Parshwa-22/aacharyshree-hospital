# Aacharyshree Hospital — Backend (Stage 1 + Stage 2)

Spring Boot 3 + MySQL backend covering **Doctors, Testimonials, Hero Slides,
Donors, and Rooms** with full CRUD, drag-and-drop reorder support, a generic
media upload endpoint, and now **JWT-based admin login/registration**.

- Anyone can **read** (GET) hospital data — that's what the public website uses.
- Only a **logged-in admin** can create/update/delete/reorder/upload — that's
  what the future admin panel will use.

## 1. Requirements
- Java 17+
- Maven 3.9+
- MySQL 8+

## 2. Setup
```bash
# 1. Create the database
mysql -u root -p -e "CREATE DATABASE aacharyshree_hospital;"

# 2. Edit src/main/resources/application.properties
#    - spring.datasource.username / password
#    - jwt.secret               (generate with: openssl rand -base64 48)
#    - admin.registration.secret (pick your own — needed to create admin accounts)

# 3. Run it
mvn spring-boot:run
```
The app starts on `http://localhost:8080`. Tables are auto-created from the
entities on first run (`spring.jpa.hibernate.ddl-auto=update`).

Uploaded files (doctor photos, hero videos, etc.) are saved to `./uploads`
next to the running app and served back at `http://localhost:8080/uploads/<file>`.

## 3. Media storage: Cloudinary

Every upload (doctor photos, hero images/videos, testimonial videos, donor
photos, room photos) goes straight to Cloudinary now — not local disk. The
account credentials are already filled in under `## Media storage
(Cloudinary)` in `application.properties`. Cloudinary auto-compresses/
optimizes everything on the way in (`quality=auto`, `fetch_format=auto`),
and the CDN URL it returns is what gets stored in the database — the
`/api/upload` endpoint's request/response shape hasn't changed, so nothing
in the admin panel needed to change either.

If you ever want to switch accounts, it's just the three properties —
`cloudinary.cloud-name`, `cloudinary.api-key`, `cloudinary.api-secret`.

## 4. Creating your first admin & logging in

```bash
# 1. Register (needs the admin.registration.secret from application.properties)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@aacharyshree.com",
    "password": "a-strong-password-here",
    "registrationSecret": "CHANGE_ME_REGISTRATION_SECRET"
  }'

# 2. Log in
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "username": "admin", "password": "a-strong-password-here" }'
# → { "token": "eyJ...", "username": "admin", "role": "ADMIN", "expiresInMs": 86400000 }

# 3. Use the token on any write endpoint
curl -X POST http://localhost:8080/api/doctors \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{ "name": "Dr. Example", "specialization": "Cardiology" }'
```

**Important:** the registration endpoint is protected only by the shared
`admin.registration.secret`, not by an existing admin's login — that's a
deliberate simplification so you can create the very first admin account
with nothing but the properties file. Once your real admin accounts exist,
consider changing that secret to something you don't reuse, or removing/
locking the endpoint (Stage 3 admin panel can add proper "invite a new
admin" flow if you need multiple admin users).

## 4. API reference

Every domain (`doctors`, `testimonials`, `hero`, `donors`) follows the same
shape. `rooms` has no reorder endpoint (order wasn't part of the original
spec for rooms). **GET is public. Everything else needs `Authorization: Bearer <token>` from an admin login.**

| Method | URL | Auth |
|---|---|---|
| GET | `/api/doctors` | Public |
| GET | `/api/doctors?active=true` | Public |
| GET | `/api/doctors/{id}` | Public |
| POST | `/api/doctors` | Admin |
| PUT | `/api/doctors/{id}` | Admin |
| DELETE | `/api/doctors/{id}` | Admin |
| PUT | `/api/doctors/reorder` | Admin |
| POST | `/api/upload` | Admin |
| POST | `/api/auth/register` | Public (needs `registrationSecret`) |
| POST | `/api/auth/login` | Public |

Same pattern for `/api/testimonials`, `/api/hero`, `/api/donors`, `/api/departments`
(with an extra `GET /api/departments/slug/{slug}`, used by the department detail page),
and `/api/counters` (homepage stat boxes — label/value/suffix, fully admin-managed,
replacing the old hardcoded "Patients Treated / Doctors / Rooms" trio).
`/api/rooms` has GET (list/one, public), POST/PUT/DELETE (admin) — no reorder.
`/api/nav-items` also follows the same pattern, plus a `location` filter:
`GET /api/nav-items?location=NAVBAR` (also matches items set to `BOTH`),
`GET /api/nav-items?location=FOOTER` (same).

**Singleton endpoints** (one record, no list/create/delete — just get + update):

| Method | URL | Auth | Purpose |
|---|---|---|---|
| GET | `/api/site-settings` | Public | Sitewide homepage hero title/subtitle |
| PUT | `/api/site-settings` | Admin | Update it |
| POST | `/api/site-settings/open-inauguration` | Public | Changes the theatre-opening status from `CLOSED` to `OPEN` after a visitor enters |
| GET | `/api/trust-info` | Public | The governing trust's About-page content |
| PUT | `/api/trust-info` | Admin | Update it |

**Reorder request body:**
```json
[
  { "id": 1, "displayOrder": 0 },
  { "id": 5, "displayOrder": 1 },
  { "id": 3, "displayOrder": 2 }
]
```

**Media upload:**
```
POST /api/upload   (multipart/form-data, field name "file", needs admin token)
→ { "url": "/uploads/3fa1...-photo.jpg" }
```

## 5. Project layout
```
entity/      Doctor, Testimonial, HeroSlide, Donor, Room (+RoomImage, RoomAmenity),
             Department, NavItem, SiteSettings, TrustInfo, AdminUser, Role
repository/  Spring Data JPA repositories
service/     Interfaces + impl/ (business logic, reorder logic)
controller/  REST endpoints (CRUD + reorder + auth) per domain
dto/         ReorderItemDto, ApiResponse, LoginRequest, RegisterRequest, AuthResponse
exception/   ResourceNotFoundException + @RestControllerAdvice handler
security/    JwtUtil, JwtAuthFilter, AdminUserDetailsService, SecurityConfig
config/      Static file serving for /uploads (CORS now lives in SecurityConfig)
```

`MediaStorageService` is an interface with one implementation today
(`LocalMediaStorageService`, saves to local disk). Swapping to S3 or
Cloudinary later is a new class implementing that interface — nothing else
in the codebase needs to change.

## 6. Starter data (nav tabs, departments, site text)

The public site reads its navbar, footer, and departments entirely from the
database now — there's no hardcoded fallback. On a brand new database
these will all be empty. Populate them in one shot with:

```bash
mysql -u root -p aacharyshree_hospital < scripts/seed-data.sql
```

This adds the core pages (Home/About/Doctors/Rooms/Donors/Products/Contact)
to both the navbar and footer, three starter departments, and default
homepage hero text — all editable afterwards from the admin panel.

## 7. If you're upgrading from an earlier version of this backend

Before deploying this version with `DB_DDL_AUTO=validate`, run
`scripts/migrations/20260809_add_site_settings_opening_status.sql` once. It adds the
database-backed `OPEN` / `CLOSED` status used by the public theatre curtain and the
admin Site Settings screen.

A few fields changed shape in this update:
- `Donor.purpose` was removed (merged into `donationType`)
- `HeroSlide.title` / `HeroSlide.subtitle` were removed (moved to the new
  sitewide `SiteSettings.heroTitle` / `heroSubtitle`, edited once from the
  admin panel instead of per-slide)
- `Room`'s separate `features` list was removed — amenities and features
  were merged into the single `amenities` checklist
- `NavItem.Location` gained a third option, `BOTH`

With `ddl-auto=update`, existing tables get new columns added automatically,
but **old columns are never dropped** — if you already had data before this
update, you'll end up with a few harmless unused columns/tables (e.g. a
leftover `purpose` column, an unused `room_features` table). Cleanest option
for a dev database: drop it and let it recreate from scratch —
```sql
DROP DATABASE aacharyshree_hospital;
CREATE DATABASE aacharyshree_hospital;
```
— then start the backend once (recreates tables) and re-run the seed script.

## 8. A note on scale
`ddl-auto=update` and a single hardcoded registration secret are dev-friendly
defaults, not production settings. Before going live you'll want: a proper
migration tool (Flyway), connection pool tuning, HTTPS, rate limiting on
`/api/auth/login`, and load testing.



## 9. Payments: Razorpay + the Products/Orders system

Products, cart, and checkout are now fully backend-driven:

- **Products** — full CRUD + multi-photo + stock + price, admin-managed like everything else.
- **Cart & Wishlist** — live in the browser (localStorage) until checkout; no customer login exists in this system by design.
- **Checkout** — `POST /api/orders/create-razorpay-order` computes the total from the database (never trusts a price sent from the browser), creates both a local `Order` and a matching Razorpay order, and returns what the frontend needs to open Razorpay's Checkout widget.
- **Payment confirmation** — `POST /api/orders/verify-payment` verifies Razorpay's signature server-side before marking anything as paid or reducing stock. A payment is never trusted just because the browser says it succeeded.
- **Order tracking** — `GET /api/orders/track?orderId=&phone=` is public but requires *both* values to match, so customers can check their own order without an account, without exposing anyone else's.
- **Admin** — `GET /api/orders` (full list) and `PUT /api/orders/{id}/status` (PLACED → CONFIRMED → PACKED → SHIPPED → DELIVERED, or CANCELLED) are admin-only.

**Before checkout will actually work**, set your real keys in `application.properties`:
```
razorpay.key-id=rzp_test_XXXXXXXXXXXX
razorpay.key-secret=XXXXXXXXXXXXXXXXXXXXXXXX
```
Get these from https://dashboard.razorpay.com → Settings → API Keys. Start with the `rzp_test_` key so you can run full test transactions (Razorpay's test mode has fake card numbers on their docs) before switching to live keys.

**What this is NOT**: a full storefront with customer accounts, order history per customer, refund handling, shipping-rate calculation, coupon codes, or invoicing. It's a working buy-now flow with real payment verification and status tracking — the essentials, not a complete e-commerce platform.

## 10. Customer login: Email + OTP (no password)

Browsing is fully open. A customer only needs to log in the moment they
Add to Cart, add to Wishlist, or hit "Proceed to Checkout" — same pattern
as Amazon/Flipkart.

- `POST /api/customer-auth/request-otp` `{ email }` — generates a 6-digit
  code (5-minute expiry) and emails it.
- `POST /api/customer-auth/verify-otp` `{ email, otp }` — verifies it;
  creates a `User` row automatically if that email hasn't been seen before
  (no separate registration step); returns a JWT the frontend stores and
  reuses for 30 days.

This is a separate, lightweight token system from the admin panel's login —
customers are never Spring Security principals here, and there's no
`/api/users` admin management screen (not requested — tell me if you want
one).

**Email requires setup before OTPs will actually arrive.** In
`application.properties`, under "Email (Gmail SMTP — free)":
```
spring.mail.username=REPLACE_WITH_YOUR_GMAIL_ADDRESS@gmail.com
spring.mail.password=REPLACE_WITH_YOUR_16_CHAR_APP_PASSWORD
```
Steps: use any Gmail account → turn on 2-Step Verification
(myaccount.google.com/security) → generate an **App Password**
(myaccount.google.com/apppasswords, pick "Mail") → paste that 16-character
password in, not the account's normal password. This same email account
also sends order-confirmation and delivery-confirmation emails
automatically (see `EmailService`) — no extra setup needed for those once
the SMTP credentials above are filled in.

## 11. What cart/wishlist login does and doesn't do

Cart and Wishlist contents still live in the browser (localStorage) — they
are **not** synced to the customer's account or persisted server-side.
Logging in gates *access* to those actions (matching the brief), but
doesn't yet give a customer their cart back on a different device. If you
want true cross-device cart sync, that's a real next step (a `Cart` table
linked to `User`) — say the word and I'll build it.
