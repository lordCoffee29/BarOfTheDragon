/*
  Warnings:

  - You are about to drop the `Base` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Base_bottle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Base_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Drink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Drink_recipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Drink_variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Drink_variant_ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingredient_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingredient_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Liquor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Liquor_bottle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Liquor_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tool_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Base" DROP CONSTRAINT "Base_type_fkey";

-- DropForeignKey
ALTER TABLE "public"."Base_bottle" DROP CONSTRAINT "Base_bottle_base_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Base_bottle" DROP CONSTRAINT "Base_bottle_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Drink_recipe" DROP CONSTRAINT "Drink_recipe_name_fkey";

-- DropForeignKey
ALTER TABLE "public"."Drink_recipe" DROP CONSTRAINT "Drink_recipe_unit_fkey";

-- DropForeignKey
ALTER TABLE "public"."Drink_variant" DROP CONSTRAINT "Drink_variant_base_drink_fkey";

-- DropForeignKey
ALTER TABLE "public"."Drink_variant" DROP CONSTRAINT "Drink_variant_drink_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Drink_variant_ingredient" DROP CONSTRAINT "Drink_variant_ingredient_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ingredient" DROP CONSTRAINT "Ingredient_type_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ingredient" DROP CONSTRAINT "Ingredient_unit_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ingredient_item" DROP CONSTRAINT "Ingredient_item_name_quantity_unit_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ingredient_item" DROP CONSTRAINT "Ingredient_item_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ingredient_item" DROP CONSTRAINT "Ingredient_item_unit_fkey";

-- DropForeignKey
ALTER TABLE "public"."Liquor" DROP CONSTRAINT "Liquor_type_fkey";

-- DropForeignKey
ALTER TABLE "public"."Liquor_bottle" DROP CONSTRAINT "Liquor_bottle_liquor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Liquor_bottle" DROP CONSTRAINT "Liquor_bottle_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tool" DROP CONSTRAINT "Tool_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tool" DROP CONSTRAINT "Tool_type_fkey";

-- DropTable
DROP TABLE "public"."Base";

-- DropTable
DROP TABLE "public"."Base_bottle";

-- DropTable
DROP TABLE "public"."Base_type";

-- DropTable
DROP TABLE "public"."Drink";

-- DropTable
DROP TABLE "public"."Drink_recipe";

-- DropTable
DROP TABLE "public"."Drink_variant";

-- DropTable
DROP TABLE "public"."Drink_variant_ingredient";

-- DropTable
DROP TABLE "public"."Ingredient";

-- DropTable
DROP TABLE "public"."Ingredient_item";

-- DropTable
DROP TABLE "public"."Ingredient_type";

-- DropTable
DROP TABLE "public"."Liquor";

-- DropTable
DROP TABLE "public"."Liquor_bottle";

-- DropTable
DROP TABLE "public"."Liquor_type";

-- DropTable
DROP TABLE "public"."Tool";

-- DropTable
DROP TABLE "public"."Tool_type";

-- DropTable
DROP TABLE "public"."Transactions";

-- DropTable
DROP TABLE "public"."Unit";

-- CreateTable
CREATE TABLE "public"."units" (
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "base_unit" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."liquor_type" (
    "name" TEXT NOT NULL,

    CONSTRAINT "liquor_type_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."liquor" (
    "liquor_id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mL" INTEGER NOT NULL,
    "ABV" INTEGER NOT NULL,
    "img_path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,

    CONSTRAINT "liquor_pkey" PRIMARY KEY ("liquor_id")
);

-- CreateTable
CREATE TABLE "public"."liquor_bottle" (
    "id" SERIAL NOT NULL,
    "liquor_id" INTEGER NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "date_opened" TIMESTAMP(3),
    "date_finished" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "liquor_bottle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."base_type" (
    "name" TEXT NOT NULL,

    CONSTRAINT "base_type_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."base" (
    "base_id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mL" INTEGER NOT NULL,
    "img_path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,

    CONSTRAINT "base_pkey" PRIMARY KEY ("base_id")
);

-- CreateTable
CREATE TABLE "public"."base_bottle" (
    "id" SERIAL NOT NULL,
    "base_id" INTEGER NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "date_opened" TIMESTAMP(3),
    "date_finished" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "base_bottle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ingredient_type" (
    "name" TEXT NOT NULL,

    CONSTRAINT "ingredient_type_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "brand" TEXT,
    "type" TEXT NOT NULL,
    "img_path" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,

    CONSTRAINT "ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ingredient_item" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "date_opened" TIMESTAMP(3),
    "date_finished" TIMESTAMP(3),

    CONSTRAINT "ingredient_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tool_type" (
    "name" TEXT NOT NULL,

    CONSTRAINT "tool_type_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."tool" (
    "name" TEXT NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "tool_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."drink" (
    "name" TEXT NOT NULL,
    "img_path" TEXT NOT NULL,

    CONSTRAINT "drink_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."drink_recipe" (
    "drink_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ingredient" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "drink_recipe_pkey" PRIMARY KEY ("drink_id")
);

-- CreateTable
CREATE TABLE "public"."drink_variant" (
    "variant_id" SERIAL NOT NULL,
    "drink_id" INTEGER NOT NULL,
    "base_drink" TEXT NOT NULL,
    "variant_name" TEXT NOT NULL,
    "img_overlay_path" TEXT,
    "notes" TEXT,

    CONSTRAINT "drink_variant_pkey" PRIMARY KEY ("variant_id")
);

-- CreateTable
CREATE TABLE "public"."drink_variant_ingredient" (
    "variant_id" INTEGER NOT NULL,
    "original_ingredient" TEXT NOT NULL,
    "replacement_ingredient" TEXT NOT NULL,

    CONSTRAINT "drink_variant_ingredient_pkey" PRIMARY KEY ("variant_id","original_ingredient")
);

-- CreateIndex
CREATE UNIQUE INDEX "liquor_brand_name_mL_key" ON "public"."liquor"("brand", "name", "mL");

-- CreateIndex
CREATE UNIQUE INDEX "base_brand_name_mL_key" ON "public"."base"("brand", "name", "mL");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_name_quantity_unit_key" ON "public"."ingredient"("name", "quantity", "unit");

-- CreateIndex
CREATE UNIQUE INDEX "drink_recipe_name_ingredient_key" ON "public"."drink_recipe"("name", "ingredient");

-- CreateIndex
CREATE UNIQUE INDEX "drink_variant_base_drink_variant_name_key" ON "public"."drink_variant"("base_drink", "variant_name");

-- AddForeignKey
ALTER TABLE "public"."liquor" ADD CONSTRAINT "liquor_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."liquor_type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."liquor_bottle" ADD CONSTRAINT "liquor_bottle_liquor_id_fkey" FOREIGN KEY ("liquor_id") REFERENCES "public"."liquor"("liquor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."liquor_bottle" ADD CONSTRAINT "liquor_bottle_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."base" ADD CONSTRAINT "base_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."base_type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."base_bottle" ADD CONSTRAINT "base_bottle_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "public"."base"("base_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."base_bottle" ADD CONSTRAINT "base_bottle_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ingredient" ADD CONSTRAINT "ingredient_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."ingredient_type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ingredient" ADD CONSTRAINT "ingredient_unit_fkey" FOREIGN KEY ("unit") REFERENCES "public"."units"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ingredient_item" ADD CONSTRAINT "ingredient_item_name_quantity_unit_fkey" FOREIGN KEY ("name", "quantity", "unit") REFERENCES "public"."ingredient"("name", "quantity", "unit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ingredient_item" ADD CONSTRAINT "ingredient_item_unit_fkey" FOREIGN KEY ("unit") REFERENCES "public"."units"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ingredient_item" ADD CONSTRAINT "ingredient_item_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tool" ADD CONSTRAINT "tool_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."tool_type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tool" ADD CONSTRAINT "tool_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."drink_recipe" ADD CONSTRAINT "drink_recipe_name_fkey" FOREIGN KEY ("name") REFERENCES "public"."drink"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."drink_recipe" ADD CONSTRAINT "drink_recipe_unit_fkey" FOREIGN KEY ("unit") REFERENCES "public"."units"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."drink_variant" ADD CONSTRAINT "drink_variant_base_drink_fkey" FOREIGN KEY ("base_drink") REFERENCES "public"."drink"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."drink_variant" ADD CONSTRAINT "drink_variant_drink_id_fkey" FOREIGN KEY ("drink_id") REFERENCES "public"."drink_recipe"("drink_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."drink_variant_ingredient" ADD CONSTRAINT "drink_variant_ingredient_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."drink_variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE;
