/*
  Warnings:

  - A unique constraint covering the columns `[subdomain]` on the table `Commerce` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,commerceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commerceId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backgroundColor` to the `Commerce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heroSubtitle` to the `Commerce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heroTitle` to the `Commerce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryColor` to the `Commerce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondaryColor` to the `Commerce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdomain` to the `Commerce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commerceId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "commerceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Commerce" ADD COLUMN     "backgroundColor" TEXT NOT NULL,
ADD COLUMN     "heroSubtitle" TEXT NOT NULL,
ADD COLUMN     "heroTitle" TEXT NOT NULL,
ADD COLUMN     "primaryColor" TEXT NOT NULL,
ADD COLUMN     "secondaryColor" TEXT NOT NULL,
ADD COLUMN     "subdomain" TEXT NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "imageURL" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "commerceId" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "Commerce_subdomain_key" ON "Commerce"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_commerceId_key" ON "User"("email", "commerceId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_commerceId_fkey" FOREIGN KEY ("commerceId") REFERENCES "Commerce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_commerceId_fkey" FOREIGN KEY ("commerceId") REFERENCES "Commerce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
