// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed notes for your CURRENT schema:
 * - purchase_category MUST ONLY contain: Liquor, Base, Ingredient, Tool
 * - transactions.receipt relation uses composite FK: (receipt_id, date) -> (receipt.id, receipt.date)
 *   so EVERY transaction.date must exactly match its receipt.date
 * - ingredient_item is now just { transaction_id, ingredient_id, date_opened/date_finished }
 */

async function main() {
  const SEED_DEMO = process.env.SEED_DEMO === "true";

  // ---------- RESET (FK order matters) ----------
  await prisma.drink_variant_ingredient.deleteMany();
  await prisma.drink_variant.deleteMany();
  await prisma.drink_recipe.deleteMany();
  await prisma.drink.deleteMany();

  await prisma.tool.deleteMany();
  await prisma.ingredient_item.deleteMany();
  await prisma.liquor_bottle.deleteMany();
  await prisma.base_bottle.deleteMany();

  await prisma.transactions.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.store.deleteMany();

  await prisma.liquor.deleteMany();
  await prisma.liquor_type.deleteMany();

  await prisma.base.deleteMany();
  await prisma.base_type.deleteMany();

  await prisma.ingredient.deleteMany();
  await prisma.ingredient_type.deleteMany();

  await prisma.tool_type.deleteMany();

  await prisma.purchase_category.deleteMany();
  await prisma.units.deleteMany();

  // ---------- MASTER TABLES ----------
  await prisma.units.createMany({
    data: [
      // volume (base_unit: ml)
      { name: "ml", type: "volume", base_unit: "ml", multiplier: 1 },
      { name: "l", type: "volume", base_unit: "ml", multiplier: 1000 },
      { name: "oz", type: "volume", base_unit: "ml", multiplier: 29.5735 },
      { name: "tsp", type: "volume", base_unit: "ml", multiplier: 4.92892 },
      { name: "tbsp", type: "volume", base_unit: "ml", multiplier: 14.7868 },

      // mass (base_unit: g)
      { name: "g", type: "mass", base_unit: "g", multiplier: 1 },
      { name: "kg", type: "mass", base_unit: "g", multiplier: 1000 },

      // count (base_unit: each)
      { name: "each", type: "count", base_unit: "each", multiplier: 1 },
    ],
  });

  await prisma.purchase_category.createMany({
    data: [{ name: "Liquor" }, { name: "Base" }, { name: "Ingredient" }, { name: "Tool" }],
  });

  await prisma.liquor_type.createMany({
    data: [
      { name: "Bourbon" },
      { name: "Gin" },
      { name: "Vodka" },
      { name: "Rum" },
      { name: "Liqueur" },
    ],
  });

  await prisma.base_type.createMany({
    data: [{ name: "Syrup" }, { name: "Soda" }, { name: "Juice" }, { name: "Mixer" }],
  });

  await prisma.ingredient_type.createMany({
    data: [{ name: "Fruit" }, { name: "Sweetener" }, { name: "Spice" }, { name: "Pantry" }],
  });

  await prisma.tool_type.createMany({
    data: [{ name: "Barware" }, { name: "Glassware" }, { name: "Gadget" }],
  });

  // ---------- CATALOG ITEMS ----------
  // Liquor (unique: [brand, name, ml])
  const makers = await prisma.liquor.create({
    data: {
      brand: "Maker's Mark",
      name: "Kentucky Straight Bourbon",
      ml: 750,
      abv: 45,
      img_path: "/img/liquor/makers_mark_750.png",
      type: "Bourbon",
      present: true,
      price: 29.99,
    },
  });

  const tanqueray = await prisma.liquor.create({
    data: {
      brand: "Tanqueray",
      name: "London Dry Gin",
      ml: 750,
      abv: 47,
      img_path: "/img/liquor/tanqueray_750.png",
      type: "Gin",
      present: true,
      price: 27.99,
    },
  });

  // Base (unique: [brand, name, ml])
  const gingerBeer = await prisma.base.create({
    data: {
      brand: "Fever-Tree",
      name: "Ginger Beer",
      ml: 200,
      img_path: "/img/base/ginger_beer.png",
      type: "Soda",
      present: true,
      price: 1.99,
    },
  });

  const hibiscusSyrup = await prisma.base.create({
    data: {
      brand: "House",
      name: "Hibiscus Syrup",
      ml: 250,
      img_path: "/img/base/hibiscus_syrup.png",
      type: "Syrup",
      present: true,
      price: 9.99,
    },
  });

  // Ingredients (unique: [name, quantity, unit])
  // These represent “stock items” you can then reference from ingredient_item via ingredient_id.
  const limeIngredient = await prisma.ingredient.create({
    data: {
      name: "Lime",
      quantity: 6,
      unit: "each",
      brand: "Fresh Farms",
      type: "Fruit",
      img_path: "/img/ingredient/lime.png",
      present: true,
      price: 4.99,
    },
  });

  const espressoIngredient = await prisma.ingredient.create({
    data: {
      name: "Espresso Powder",
      quantity: 100,
      unit: "g",
      brand: "Medaglia D'Oro",
      type: "Pantry",
      img_path: "/img/ingredient/espresso_powder.png",
      present: true,
      price: 6.49,
    },
  });

  const darkChocolateIngredient = await prisma.ingredient.create({
    data: {
      name: "Dark Chocolate",
      quantity: 100,
      unit: "g",
      brand: "Ghirardelli",
      type: "Pantry",
      img_path: "/img/ingredient/dark_chocolate.png",
      present: true,
      price: 3.99,
    },
  });

  const seaSaltIngredient = await prisma.ingredient.create({
    data: {
      name: "Sea Salt",
      quantity: 200,
      unit: "g",
      brand: "Morton",
      type: "Spice",
      img_path: "/img/ingredient/sea_salt.png",
      present: true,
      price: 2.49,
    },
  });

  // ---------- RECEIPT + TRANSACTIONS ----------
  // ---- STORE + RECEIPT (receipt now requires store_loc) ----
const store1 = await prisma.store.upsert({
  where: { address: "123 Dragon Ave, Dallas, TX 75205" },
  update: {},
  create: {
    address: "123 Dragon Ave, Dallas, TX 75205",
    name: "Bar of the Dragon Market",
  },
});

const receiptDate1 = new Date("2026-01-02T20:15:00.000Z");
const receipt1 = await prisma.receipt.create({
  data: {
    date: receiptDate1,
    store_loc: store1.address,
  },
  select: { id: true, date: true },
});


  // transaction.date MUST == receipt.date (composite FK)
  const t1 = await prisma.transactions.create({
    data: {
      receipt_id: receipt1.id,
      line_num: 1,
      item: "Kentucky Straight Bourbon 750ml",
      brand: "Maker's Mark",
      category: "Liquor",
      date: receipt1.date,
      price: 29.99,
      note: "Seed: liquor purchase",
      quantity: 1,
    },
  });

  const t2 = await prisma.transactions.create({
    data: {
      receipt_id: receipt1.id,
      line_num: 2,
      item: "London Dry Gin 750ml",
      brand: "Tanqueray",
      category: "Liquor",
      date: receipt1.date,
      price: 27.99,
      note: "Seed: liquor purchase",
      quantity: 1,
    },
  });

  const t3 = await prisma.transactions.create({
    data: {
      receipt_id: receipt1.id,
      line_num: 3,
      item: "Ginger Beer (6-pack)",
      brand: "Fever-Tree",
      category: "Base",
      date: receipt1.date,
      price: 9.99,
      note: "Seed: base purchase",
      quantity: 1,
      pack_size: 6,
    },
  });

  const t4 = await prisma.transactions.create({
    data: {
      receipt_id: receipt1.id,
      line_num: 4,
      item: "Hibiscus Syrup 250ml",
      brand: "House",
      category: "Base",
      date: receipt1.date,
      price: 9.99,
      note: "Seed: base purchase",
      quantity: 1,
    },
  });

  const t5 = await prisma.transactions.create({
    data: {
      receipt_id: receipt1.id,
      line_num: 5,
      item: "Limes (bag)",
      brand: "Fresh Farms",
      category: "Ingredient",
      date: receipt1.date,
      price: 4.99,
      note: "Seed: ingredient purchase",
      quantity: 1,
      pack_size: 6,
    },
  });

  const t6 = await prisma.transactions.create({
    data: {
      receipt_id: receipt1.id,
      line_num: 6,
      item: "Espresso Powder 100g",
      brand: "Medaglia D'Oro",
      category: "Ingredient",
      date: receipt1.date,
      price: 6.49,
      note: "Seed: ingredient purchase",
      quantity: 1,
    },
  });

  const t7 = await prisma.transactions.create({
    data: {
      receipt_id: receipt1.id,
      line_num: 7,
      item: "Jigger",
      brand: "OXO",
      category: "Tool",
      date: receipt1.date,
      price: 12.99,
      note: "Seed: tool purchase",
      quantity: 1,
    },
  });

  // Optional second receipt (demo mode) for extra test rows
  let receipt2: { id: number; date: Date } | null = null;
  let t8: { id: number } | null = null;

  if (SEED_DEMO) {
    // ---- Optional second store + receipt (demo mode) ----
const store2 = await prisma.store.upsert({
  where: { address: "900 Neon Blvd, Dallas, TX 75201" },
  update: {},
  create: {
    address: "900 Neon Blvd, Dallas, TX 75201",
    name: "Neon Spirits & Mixers",
  },
});

const receiptDate2 = new Date("2026-01-03T03:10:00.000Z");
receipt2 = await prisma.receipt.create({
  data: {
    date: receiptDate2,
    store_loc: store2.address,
  },
  select: { id: true, date: true },
});


    t8 = await prisma.transactions.create({
      data: {
        receipt_id: receipt2.id,
        line_num: 1,
        item: "Dark Chocolate 100g",
        brand: "Ghirardelli",
        category: "Ingredient",
        date: receipt2.date,
        price: 3.99,
        note: "Seed demo: ingredient purchase",
        quantity: 1,
      },
    });
  }

  // ---------- INVENTORY INSTANCES ----------
  await prisma.liquor_bottle.createMany({
    data: [
      { liquor_id: makers.liquor_id, transaction_id: t1.id, quantity: 100 },
      { liquor_id: tanqueray.liquor_id, transaction_id: t2.id, quantity: 100 },
    ],
  });

  await prisma.base_bottle.createMany({
    data: [
      { base_id: gingerBeer.id, transaction_id: t3.id, quantity: 100 },
      { base_id: hibiscusSyrup.id, transaction_id: t4.id, quantity: 100 },
    ],
  });

  // ingredient_item now references ingredient by ingredient_id only
  await prisma.ingredient_item.createMany({
    data: [
      {
        transaction_id: t5.id,
        ingredient_id: limeIngredient.id,
        date_opened: receipt1.date,
        date_finished: null,
      },
      {
        transaction_id: t6.id,
        ingredient_id: espressoIngredient.id,
        date_opened: receipt1.date,
        date_finished: null,
      },
      ...(SEED_DEMO && receipt2 && t8
        ? [
            {
              transaction_id: t8.id,
              ingredient_id: darkChocolateIngredient.id,
              date_opened: receipt2.date,
              date_finished: null,
            },
          ]
        : []),
    ],
  });

  await prisma.tool.create({
    data: {
      name: "Jigger",
      transaction_id: t7.id,
      quantity: 1,
      unit: "each",
      type: "Barware",
      price: 12.99,
    },
  });

  // ---------- DRINKS / RECIPES / VARIANTS ----------
  await prisma.drink.createMany({
    data: [
      { name: "Crimson Mule", img_path: "/img/drinks/crimson_mule.png" },
      { name: "Nocturne", img_path: "/img/drinks/nocturne.png" },
    ],
  });

  // drink_recipe.quantity is Int; unit must exist in units
  const crimsonGinRow = await prisma.drink_recipe.create({
    data: {
      name: "Crimson Mule",
      ingredient: "Gin",
      quantity: 2,
      unit: "oz",
    },
  });

  await prisma.drink_recipe.createMany({
    data: [
      { name: "Crimson Mule", ingredient: "Ginger Beer", quantity: 4, unit: "oz" },
      { name: "Crimson Mule", ingredient: "Hibiscus Syrup", quantity: 1, unit: "oz" },

      { name: "Nocturne", ingredient: "Bourbon", quantity: 2, unit: "oz" },
      { name: "Nocturne", ingredient: "Dark Chocolate (infused)", quantity: 1, unit: "oz" },
    ],
  });

  // drink_variant points at a specific recipe row (drink_id -> drink_recipe.id)
  const crimsonVariant = await prisma.drink_variant.create({
    data: {
      drink_id: crimsonGinRow.id,
      base_drink: "Crimson Mule",
      variant_name: "Blood Orange",
      img_overlay_path: "/img/drinks/overlays/blood_orange.png",
      notes: "Swap gin for blood orange gin; garnish with orange wheel.",
    },
  });

  await prisma.drink_variant_ingredient.createMany({
    data: [
      {
        variant_id: crimsonVariant.id,
        original_ingredient: "Gin",
        replacement_ingredient: "Blood Orange Gin",
      },
    ],
  });

  // Keep eslint/ts from complaining about unused seeds (handy for debugging)
  void seaSaltIngredient;

  console.log(`✅ Seed complete${SEED_DEMO ? " (demo mode)" : ""}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
