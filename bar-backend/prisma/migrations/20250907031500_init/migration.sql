-- CreateTable
CREATE TABLE "public"."Unit" (
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "base_unit" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Liquor_type" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Liquor_type_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."Liquor" (
    "liquor_id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mL" INTEGER NOT NULL,
    "ABV" INTEGER NOT NULL,
    "img_path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,

    CONSTRAINT "Liquor_pkey" PRIMARY KEY ("liquor_id")
);

-- CreateTable
CREATE TABLE "public"."Liquor_bottle" (
    "id" SERIAL NOT NULL,
    "liquor_id" INTEGER NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "date_opened" TIMESTAMP(3),
    "date_finished" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "Liquor_bottle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Base_type" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Base_type_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."Base" (
    "base_id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mL" INTEGER NOT NULL,
    "img_path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,

    CONSTRAINT "Base_pkey" PRIMARY KEY ("base_id")
);

-- CreateTable
CREATE TABLE "public"."Base_bottle" (
    "id" SERIAL NOT NULL,
    "base_id" INTEGER NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "date_opened" TIMESTAMP(3),
    "date_finished" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "Base_bottle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ingredient_type" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Ingredient_type_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "brand" TEXT,
    "type" TEXT NOT NULL,
    "img_path" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ingredient_item" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "date_opened" TIMESTAMP(3),
    "date_finished" TIMESTAMP(3),

    CONSTRAINT "Ingredient_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tool_type" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Tool_type_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."Tool" (
    "name" TEXT NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."Drink" (
    "name" TEXT NOT NULL,
    "img_path" TEXT NOT NULL,

    CONSTRAINT "Drink_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."Drink_recipe" (
    "drink_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ingredient" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "Drink_recipe_pkey" PRIMARY KEY ("drink_id")
);

-- CreateTable
CREATE TABLE "public"."Drink_variant" (
    "variant_id" SERIAL NOT NULL,
    "drink_id" INTEGER NOT NULL,
    "base_drink" TEXT NOT NULL,
    "variant_name" TEXT NOT NULL,
    "img_overlay_path" TEXT,
    "notes" TEXT,

    CONSTRAINT "Drink_variant_pkey" PRIMARY KEY ("variant_id")
);

-- CreateTable
CREATE TABLE "public"."Drink_variant_ingredient" (
    "variant_id" INTEGER NOT NULL,
    "original_ingredient" TEXT NOT NULL,
    "replacement_ingredient" TEXT NOT NULL,

    CONSTRAINT "Drink_variant_ingredient_pkey" PRIMARY KEY ("variant_id","original_ingredient")
);

-- CreateIndex
CREATE UNIQUE INDEX "Liquor_brand_name_mL_key" ON "public"."Liquor"("brand", "name", "mL");

-- CreateIndex
CREATE UNIQUE INDEX "Base_brand_name_mL_key" ON "public"."Base"("brand", "name", "mL");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_quantity_unit_key" ON "public"."Ingredient"("name", "quantity", "unit");

-- CreateIndex
CREATE UNIQUE INDEX "Drink_recipe_name_ingredient_key" ON "public"."Drink_recipe"("name", "ingredient");

-- CreateIndex
CREATE UNIQUE INDEX "Drink_variant_base_drink_variant_name_key" ON "public"."Drink_variant"("base_drink", "variant_name");

-- AddForeignKey
ALTER TABLE "public"."Liquor" ADD CONSTRAINT "Liquor_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."Liquor_type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Liquor_bottle" ADD CONSTRAINT "Liquor_bottle_liquor_id_fkey" FOREIGN KEY ("liquor_id") REFERENCES "public"."Liquor"("liquor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Liquor_bottle" ADD CONSTRAINT "Liquor_bottle_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Base" ADD CONSTRAINT "Base_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."Base_type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Base_bottle" ADD CONSTRAINT "Base_bottle_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "public"."Base"("base_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Base_bottle" ADD CONSTRAINT "Base_bottle_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ingredient" ADD CONSTRAINT "Ingredient_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."Ingredient_type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ingredient" ADD CONSTRAINT "Ingredient_unit_fkey" FOREIGN KEY ("unit") REFERENCES "public"."Unit"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ingredient_item" ADD CONSTRAINT "Ingredient_item_name_quantity_unit_fkey" FOREIGN KEY ("name", "quantity", "unit") REFERENCES "public"."Ingredient"("name", "quantity", "unit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ingredient_item" ADD CONSTRAINT "Ingredient_item_unit_fkey" FOREIGN KEY ("unit") REFERENCES "public"."Unit"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ingredient_item" ADD CONSTRAINT "Ingredient_item_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tool" ADD CONSTRAINT "Tool_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."Tool_type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tool" ADD CONSTRAINT "Tool_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Drink_recipe" ADD CONSTRAINT "Drink_recipe_name_fkey" FOREIGN KEY ("name") REFERENCES "public"."Drink"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Drink_recipe" ADD CONSTRAINT "Drink_recipe_unit_fkey" FOREIGN KEY ("unit") REFERENCES "public"."Unit"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Drink_variant" ADD CONSTRAINT "Drink_variant_base_drink_fkey" FOREIGN KEY ("base_drink") REFERENCES "public"."Drink"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Drink_variant" ADD CONSTRAINT "Drink_variant_drink_id_fkey" FOREIGN KEY ("drink_id") REFERENCES "public"."Drink_recipe"("drink_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Drink_variant_ingredient" ADD CONSTRAINT "Drink_variant_ingredient_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."Drink_variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE;
