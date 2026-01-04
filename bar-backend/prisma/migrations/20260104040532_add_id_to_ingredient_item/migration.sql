/*
  Warnings:

  - A unique constraint covering the columns `[name,quantity,unit,id]` on the table `ingredient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ingredient_id` to the `ingredient_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ingredient_item" DROP CONSTRAINT "ingredient_item_name_quantity_unit_fkey";

-- DropIndex
DROP INDEX "public"."ingredient_name_quantity_unit_key";

-- AlterTable
ALTER TABLE "public"."ingredient_item" ADD COLUMN     "ingredient_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_name_quantity_unit_id_key" ON "public"."ingredient"("name", "quantity", "unit", "id");

-- AddForeignKey
ALTER TABLE "public"."ingredient_item" ADD CONSTRAINT "ingredient_item_name_quantity_unit_ingredient_id_fkey" FOREIGN KEY ("name", "quantity", "unit", "ingredient_id") REFERENCES "public"."ingredient"("name", "quantity", "unit", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
