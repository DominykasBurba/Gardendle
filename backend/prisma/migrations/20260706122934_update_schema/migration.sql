/*
  Warnings:

  - Added the required column `gridSize` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revealOrder` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GridSize" AS ENUM ('GRID_3X3', 'GRID_4X4', 'GRID_5X5');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "gridSize" "GridSize" NOT NULL,
ADD COLUMN     "revealOrder" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "UserResult" ALTER COLUMN "completedAt" DROP NOT NULL,
ALTER COLUMN "completedAt" DROP DEFAULT;
