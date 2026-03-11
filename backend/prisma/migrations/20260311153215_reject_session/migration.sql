-- AlterEnum
ALTER TYPE "SessionStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "vipSession" ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "rejectedBy" TEXT;
