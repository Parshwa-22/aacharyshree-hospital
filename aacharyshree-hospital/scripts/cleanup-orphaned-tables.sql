-- ============================================================
-- One-time cleanup: removes a leftover table from an earlier
-- version of this backend.
--
-- What happened: an early version had a separate `room_features`
-- table (title/value pairs) that was later merged into
-- `room_amenities`. The Java code was updated, but
-- spring.jpa.hibernate.ddl-auto=update only ever ADDS columns/
-- tables — it never drops old ones. So `room_features` (and its
-- foreign key back to `rooms`) is still sitting in your database,
-- and MySQL still enforces that foreign key even though nothing
-- in the backend uses the table anymore. That's what's been
-- causing "internal server error" / foreign key constraint
-- failures when deleting a room.
--
-- Run this once:
--   mysql -u root -p aacharyshree_hospital < scripts/cleanup-orphaned-tables.sql
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS room_features;
SET FOREIGN_KEY_CHECKS = 1;
