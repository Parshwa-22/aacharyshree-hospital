-- ============================================================
-- Aacharyshree Hospital — starter data seed
--
-- Run this ONCE after the backend has started at least once (so the
-- tables already exist). Populates the navbar/footer with the core
-- pages and a starting set of departments, so the site isn't empty
-- before you've added real content in the admin panel.
--
-- Run it with:
--   mysql -u root -p aacharyshree_hospital < scripts/seed-data.sql
-- ============================================================

-- ---------- Navbar + Footer links (BOTH = shows in both places) ----------
INSERT INTO nav_items (label, path, open_in_new_tab, location, display_order, is_active, created_at, updated_at) VALUES
  ('Home',     '/',        0, 'BOTH', 0, 1, NOW(), NOW()),
  ('About',    '/about',   0, 'BOTH', 1, 1, NOW(), NOW()),
  ('Doctors',  '/doctors', 0, 'BOTH', 2, 1, NOW(), NOW()),
  ('Rooms',    '/rooms',   0, 'BOTH', 3, 1, NOW(), NOW()),
  ('Donors',   '/donors',  0, 'BOTH', 4, 1, NOW(), NOW()),
  ('Products', '/products',0, 'BOTH', 5, 1, NOW(), NOW()),
  ('Contact',  '/contact', 0, 'BOTH', 6, 1, NOW(), NOW());

-- ---------- Starter departments ----------
INSERT INTO departments (title, slug, image, description, services, display_order, is_active, created_at, updated_at) VALUES
  ('Cardiology', 'cardiology', '/images/allopathic.jpg',
   'Our cardiology team combines advanced diagnostics with compassionate care to treat and prevent heart conditions, from routine checkups to complex cardiac procedures.',
   'Heart Failure,Cardiac Surgery,Interventional Cardiology,Preventive Cardiology', 0, 1, NOW(), NOW()),
  ('Neurology', 'neurology', '/images/ayurvedic.jpg',
   'Comprehensive neurological care covering the brain, spine and nervous system, backed by modern imaging and rehabilitation support.',
   'Stroke Care,Neurosurgery,Epilepsy Clinic,Neuro Rehabilitation', 1, 1, NOW(), NOW()),
  ('Orthopedics', 'orthopedics', '/images/diagnostic.jpg',
   'From sports injuries to joint replacement, our orthopedic specialists help patients regain mobility and live pain-free.',
   'Joint Replacement,Sports Medicine,Trauma Care,Spine Surgery', 2, 1, NOW(), NOW());

-- ---------- Site settings (homepage hero heading) ----------
INSERT INTO site_settings (id, hero_title, hero_subtitle, opening_status, updated_at)
VALUES (1, 'Welcome to Aacharyshree Hospital', 'Your Health, Our Priority', 'CLOSED', NOW())
ON DUPLICATE KEY UPDATE hero_title = hero_title;

-- ---------- Trust info (About page) ----------
INSERT INTO trust_info (id, name, established_year, description, achievements, image, updated_at)
VALUES (1, 'Vidya Sanmati Das Seva Sanstha', '',
        'Add your trust''s story here from the admin panel — the About page pulls this live.',
        '', '', NOW())
ON DUPLICATE KEY UPDATE name = name;

-- ---------- Starter homepage counters ----------
INSERT INTO counters (label, value, suffix, display_order, is_active, created_at, updated_at) VALUES
  ('Patients Treated', 25000, '+', 0, 1, NOW(), NOW()),
  ('Expert Doctors', 120, '+', 1, 1, NOW(), NOW()),
  ('Hospital Rooms', 75, '+', 2, 1, NOW(), NOW());

-- ---------- Starter department contacts ----------
INSERT INTO contacts (department, phone, availability, display_order, is_active, created_at, updated_at) VALUES
  ('Appointment Related Queries', '+91 98765 43210', '9 AM - 6 PM', 0, 1, NOW(), NOW()),
  ('Medical Queries', '+91 98765 43211', '9 AM - 5 PM', 1, 1, NOW(), NOW()),
  ('OPD Appointments', '+91 98765 43212', '7 AM - 2 PM', 2, 1, NOW(), NOW()),
  ('Emergency / Ambulance', '108', '24 Hours', 3, 1, NOW(), NOW()),
  ('Home Sample Collection', '+91 98765 43213', '10 AM - 4 PM', 4, 1, NOW(), NOW()),
  ('Blood Bank', '+91 98765 43214', '8 AM - 8 PM', 5, 1, NOW(), NOW()),
  ('Ayurvedic Department', '+91 98765 43215', '9 AM - 6 PM', 6, 1, NOW(), NOW()),
  ('Allopathic Department', '+91 98765 43216', '9 AM - 5 PM', 7, 1, NOW(), NOW()),
  ('Diagnostic Department', '+91 98765 43217', '7 AM - 2 PM', 8, 1, NOW(), NOW());
