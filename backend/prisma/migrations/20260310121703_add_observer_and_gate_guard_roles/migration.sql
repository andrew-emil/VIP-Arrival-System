/*
  Warnings:

  - You are about to drop the `VIPSession` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ip]` on the table `Camera` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'OBSERVER';
ALTER TYPE "Role" ADD VALUE 'GATE_GUARD';

-- DropForeignKey
ALTER TABLE "VIPSession" DROP CONSTRAINT "VIPSession_eventId_fkey";

-- DropForeignKey
ALTER TABLE "VIPSession" DROP CONSTRAINT "VIPSession_vipId_fkey";

-- DropTable
DROP TABLE "VIPSession";

-- CreateTable
CREATE TABLE "vipSession" (
    "id" TEXT NOT NULL,
    "vipId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL,
    "approachAt" TIMESTAMP(3),
    "arrivedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "confirmedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vipSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Camera_ip_key" ON "Camera"("ip");

-- CreateIndex
CREATE INDEX "PlateEvent_plate_idx" ON "PlateEvent"("plate");

-- CreateIndex
CREATE INDEX "PlateEvent_timestamp_idx" ON "PlateEvent"("timestamp");

-- CreateIndex
CREATE INDEX "PlateEvent_eventId_idx" ON "PlateEvent"("eventId");

-- AddForeignKey
ALTER TABLE "vipSession" ADD CONSTRAINT "vipSession_vipId_fkey" FOREIGN KEY ("vipId") REFERENCES "vip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vipSession" ADD CONSTRAINT "vipSession_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
