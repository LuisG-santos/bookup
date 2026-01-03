/*
  Warnings:

  - Added the required column `endDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "endDate" TIMESTAMPTZ(3),
ALTER COLUMN "date" SET DATA TYPE TIMESTAMPTZ(3);

--extension
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
ADD CONSTRAINT booking_no_overlap_active
EXCLUDE USING gist (
  "commerceId" WITH =,
  tstzrange("date", "endDate", '[)') WITH &&
)
WHERE ("status" IN ('PENDING', 'CONFIRMED'));
