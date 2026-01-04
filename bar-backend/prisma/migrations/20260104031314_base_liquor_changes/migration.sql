/*
  Warnings:

  - You are about to drop the column `mL` on the `base` table. All the data in the column will be lost.
  - You are about to drop the column `ABV` on the `liquor` table. All the data in the column will be lost.
  - You are about to drop the column `mL` on the `liquor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[brand,name,ml]` on the table `base` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[brand,name,ml]` on the table `liquor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ml` to the `base` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abv` to the `liquor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ml` to the `liquor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."base_brand_name_mL_key";

-- DropIndex
DROP INDEX "public"."liquor_brand_name_mL_key";

-- AlterTable
ALTER TABLE "public"."base" DROP COLUMN "mL",
ADD COLUMN     "ml" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."liquor" DROP COLUMN "ABV",
DROP COLUMN "mL",
ADD COLUMN     "abv" INTEGER NOT NULL,
ADD COLUMN     "ml" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."transactions" ADD COLUMN     "pack_size" INTEGER,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "base_brand_name_ml_key" ON "public"."base"("brand", "name", "ml");

-- CreateIndex
CREATE UNIQUE INDEX "liquor_brand_name_ml_key" ON "public"."liquor"("brand", "name", "ml");
