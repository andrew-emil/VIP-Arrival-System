-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('exact', 'none');

-- CreateTable
CREATE TABLE "PlateRead" (
    "id" TEXT NOT NULL,
    "plateRaw" TEXT NOT NULL,
    "plateNormalized" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cameraId" TEXT NOT NULL,
    "cameraKnown" BOOLEAN NOT NULL DEFAULT true,
    "isVip" BOOLEAN NOT NULL,
    "matchType" "MatchType" NOT NULL,
    "vipId" TEXT,
    "rawPayload" JSONB NOT NULL,
    "processingLogs" JSONB NOT NULL,
    "warnings" JSONB,

    CONSTRAINT "PlateRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vip" (
    "id" TEXT NOT NULL,
    "plateNormalized" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Vip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Camera" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,

    CONSTRAINT "Camera_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlateRead_plateNormalized_idx" ON "PlateRead"("plateNormalized");

-- CreateIndex
CREATE INDEX "PlateRead_cameraId_idx" ON "PlateRead"("cameraId");

-- CreateIndex
CREATE INDEX "PlateRead_receivedAt_idx" ON "PlateRead"("receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Vip_plateNormalized_key" ON "Vip"("plateNormalized");

-- AddForeignKey
ALTER TABLE "PlateRead" ADD CONSTRAINT "PlateRead_vipId_fkey" FOREIGN KEY ("vipId") REFERENCES "Vip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlateRead" ADD CONSTRAINT "PlateRead_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
