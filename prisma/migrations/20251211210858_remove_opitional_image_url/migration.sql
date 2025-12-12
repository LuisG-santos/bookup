/*
  Warnings:

  - Made the column `imageURL` on table `Commerce` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Commerce" ALTER COLUMN "imageURL" SET NOT NULL;
