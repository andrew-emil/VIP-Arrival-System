/*
  Warnings:

  - You are about to drop the column `cameraKnown` on the `PlateRead` table. All the data in the column will be lost.
  - You are about to drop the column `processingLogs` on the `PlateRead` table. All the data in the column will be lost.
  - You are about to drop the column `warnings` on the `PlateRead` table. All the data in the column will be lost.
  - Added the required column `source` to the `PlateRead` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CameraSource" AS ENUM ('webhook', 'manual');

-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('received', 'normalized', 'matched');

-- AlterTable
ALTER TABLE "PlateRead" DROP COLUMN "cameraKnown",
DROP COLUMN "processingLogs",
DROP COLUMN "warnings",
ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "snapshotUrl" TEXT,
ADD COLUMN     "source" "CameraSource" NOT NULL;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "plateReadId" TEXT NOT NULL,
    "eventType" "AuditEventType" NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlateRead" ADD CONSTRAINT "PlateRead_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_plateReadId_fkey" FOREIGN KEY ("plateReadId") REFERENCES "PlateRead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
