/*
  Warnings:

  - A unique constraint covering the columns `[id,date]` on the table `receipt` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `base` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `liquor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `tool` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_receipt_id_fkey";

-- AlterTable
ALTER TABLE "public"."base" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "public"."ingredient" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "public"."liquor" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "public"."tool" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "public"."purchase_category" (
    "name" TEXT NOT NULL,

    CONSTRAINT "purchase_category_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "receipt_id_date_key" ON "public"."receipt"("id", "date");

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."purchase_category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_receipt_id_date_fkey" FOREIGN KEY ("receipt_id", "date") REFERENCES "public"."receipt"("id", "date") ON DELETE RESTRICT ON UPDATE CASCADE;
