-- This is an empty migration.
CREATE UNIQUE INDEX IF NOT EXISTS "booking_active_slot_unique"
ON  "Booking" ("commerceId", "date")
WHERE "status" IN ('PENDING', 'CONFIRMED');