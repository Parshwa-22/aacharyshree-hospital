ALTER TABLE doctors
    MODIFY COLUMN availability_type ENUM('DAILY', 'ON_CALL', 'MONTHLY_DAYS') NOT NULL DEFAULT 'DAILY',
    ADD COLUMN available_days_of_month VARCHAR(1000) NULL;
