-- Run once on an existing production database before deploying the backend
-- with DB_DDL_AUTO=validate.
ALTER TABLE site_settings
    ADD COLUMN opening_status VARCHAR(16) NOT NULL DEFAULT 'CLOSED';
