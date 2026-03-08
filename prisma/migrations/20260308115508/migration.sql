/*
  Warnings:

  - You are about to drop the column `eventType` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `plateReadId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the `PlateRead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vip` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `action` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `Camera` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Camera` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Camera` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'OPERATOR', 'MANAGER');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('REGISTERED', 'APPROACHING', 'ARRIVED', 'CONFIRMED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CameraRole" AS ENUM ('APPROACH', 'GATE');

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_plateReadId_fkey";

-- DropForeignKey
ALTER TABLE "PlateRead" DROP CONSTRAINT "PlateRead_cameraId_fkey";

-- DropForeignKey
ALTER TABLE "PlateRead" DROP CONSTRAINT "PlateRead_vipId_fkey";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "eventType",
DROP COLUMN "plateReadId",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Camera" ADD COLUMN     "eventId" TEXT NOT NULL,
ADD COLUMN     "lastSeen" TIMESTAMP(3),
ADD COLUMN     "role" "CameraRole" NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "PlateRead";

-- DropTable
DROP TABLE "Vip";

-- DropEnum
DROP TYPE "AuditEventType";

-- DropEnum
DROP TYPE "CameraSource";

-- DropEnum
DROP TYPE "MatchType";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "window" INTEGER NOT NULL DEFAULT 480,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VIP" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "protocolLevel" TEXT,
    "notes" TEXT,
    "photoUrl" TEXT,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VIP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plate" (
    "id" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "vipId" TEXT NOT NULL,

    CONSTRAINT "Plate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlateEvent" (
    "id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "cameraId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "isLate" BOOLEAN NOT NULL DEFAULT false,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlateEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VIPSession" (
    "id" TEXT NOT NULL,
    "vipId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL,
    "approachAt" TIMESTAMP(3),
    "arrivedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "confirmedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VIPSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "grantedBy" TEXT NOT NULL,
    "eventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "cameraId" TEXT NOT NULL,
    "temporaryPassword" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plate_plateNumber_key" ON "Plate"("plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PlateEvent_idempotencyKey_key" ON "PlateEvent"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserPermission_userId_idx" ON "UserPermission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceAccount_deviceId_key" ON "DeviceAccount"("deviceId");

-- AddForeignKey
ALTER TABLE "VIP" ADD CONSTRAINT "VIP_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plate" ADD CONSTRAINT "Plate_vipId_fkey" FOREIGN KEY ("vipId") REFERENCES "VIP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlateEvent" ADD CONSTRAINT "PlateEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlateEvent" ADD CONSTRAINT "PlateEvent_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIPSession" ADD CONSTRAINT "VIPSession_vipId_fkey" FOREIGN KEY ("vipId") REFERENCES "VIP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIPSession" ADD CONSTRAINT "VIPSession_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceAccount" ADD CONSTRAINT "DeviceAccount_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
