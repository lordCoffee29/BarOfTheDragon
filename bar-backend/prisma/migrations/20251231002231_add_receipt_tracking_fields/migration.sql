/*
  Warnings:

  - The primary key for the `base` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `base_id` on the `base` table. All the data in the column will be lost.
  - The primary key for the `drink_recipe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `drink_id` on the `drink_recipe` table. All the data in the column will be lost.
  - The primary key for the `drink_variant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `variant_id` on the `drink_variant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."base_bottle" DROP CONSTRAINT "base_bottle_base_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."drink_variant" DROP CONSTRAINT "drink_variant_drink_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."drink_variant_ingredient" DROP CONSTRAINT "drink_variant_ingredient_variant_id_fkey";

-- AlterTable
ALTER TABLE "public"."base" DROP CONSTRAINT "base_pkey",
DROP COLUMN "base_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "brand" DROP NOT NULL,
ADD CONSTRAINT "base_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."drink_recipe" DROP CONSTRAINT "drink_recipe_pkey",
DROP COLUMN "drink_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "drink_recipe_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."drink_variant" DROP CONSTRAINT "drink_variant_pkey",
DROP COLUMN "variant_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "drink_variant_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."ingredient_item" ALTER COLUMN "brand" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."liquor" ALTER COLUMN "brand" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."transactions" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "line_num" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "receipt_id" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "brand" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."base_bottle" ADD CONSTRAINT "base_bottle_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "public"."base"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."drink_variant" ADD CONSTRAINT "drink_variant_drink_id_fkey" FOREIGN KEY ("drink_id") REFERENCES "public"."drink_recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."drink_variant_ingredient" ADD CONSTRAINT "drink_variant_ingredient_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."drink_variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
