/*
  Warnings:

  - You are about to drop the `VIP` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ip` to the `Camera` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Plate" DROP CONSTRAINT "Plate_vipId_fkey";

-- DropForeignKey
ALTER TABLE "VIP" DROP CONSTRAINT "VIP_eventId_fkey";

-- DropForeignKey
ALTER TABLE "VIPSession" DROP CONSTRAINT "VIPSession_vipId_fkey";

-- AlterTable
ALTER TABLE "Camera" ADD COLUMN     "ip" TEXT NOT NULL;

-- DropTable
DROP TABLE "VIP";

-- CreateTable
CREATE TABLE "vip" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "protocolLevel" TEXT,
    "notes" TEXT,
    "photoUrl" TEXT,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vip" ADD CONSTRAINT "vip_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plate" ADD CONSTRAINT "Plate_vipId_fkey" FOREIGN KEY ("vipId") REFERENCES "vip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIPSession" ADD CONSTRAINT "VIPSession_vipId_fkey" FOREIGN KEY ("vipId") REFERENCES "vip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
