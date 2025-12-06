-- AlterTable
ALTER TABLE "Commerce" ADD COLUMN     "closingTimeMinutes" INTEGER NOT NULL DEFAULT 1020,
ADD COLUMN     "openingTimeMinutes" INTEGER NOT NULL DEFAULT 540;
