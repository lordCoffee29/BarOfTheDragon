/*
  Warnings:

  - You are about to drop the column `date` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receipt_id,line_num]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `updated_at` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/

-- First, update any NULL values in updated_at
UPDATE "public"."transactions" SET "updated_at" = CURRENT_TIMESTAMP WHERE "updated_at" IS NULL;

-- CreateTable (create receipt table first)
CREATE TABLE "public"."receipt" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipt_pkey" PRIMARY KEY ("id")
);

-- Create a receipt for existing transactions and migrate the date
INSERT INTO "public"."receipt" ("date", "created_at", "updated_at")
SELECT DISTINCT "date", "created_at", "updated_at" 
FROM "public"."transactions"
ORDER BY "date";

-- Update transactions to reference the created receipt(s) and set line_num
-- This assumes all existing transactions belong to the same receipt
UPDATE "public"."transactions" 
SET "receipt_id" = (SELECT MIN(id) FROM "public"."receipt"),
    "line_num" = 1
WHERE "receipt_id" = 0;

-- AlterTable
ALTER TABLE "public"."transactions" DROP COLUMN "date",
ALTER COLUMN "line_num" DROP DEFAULT,
ALTER COLUMN "receipt_id" DROP DEFAULT,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_receipt_id_line_num_key" ON "public"."transactions"("receipt_id", "line_num");

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "public"."receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
