/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Base_bottle" DROP CONSTRAINT "Base_bottle_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ingredient_item" DROP CONSTRAINT "Ingredient_item_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Liquor_bottle" DROP CONSTRAINT "Liquor_bottle_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tool" DROP CONSTRAINT "Tool_transaction_id_fkey";

-- DropTable
DROP TABLE "public"."Transaction";

-- CreateTable
CREATE TABLE "public"."Transactions" (
    "id" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Liquor_bottle" ADD CONSTRAINT "Liquor_bottle_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Base_bottle" ADD CONSTRAINT "Base_bottle_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ingredient_item" ADD CONSTRAINT "Ingredient_item_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tool" ADD CONSTRAINT "Tool_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
