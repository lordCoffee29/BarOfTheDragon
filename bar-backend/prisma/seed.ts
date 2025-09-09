import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const REQUIRED = {
    units: ['ml', 'oz', 'count'],
    liquorTypes: ['whiskey', 'gin', 'vodka', 'rum', 'tequila', 'brandy', 'liqueur', 'beer'],
    baseTypes: ['soda', 'juice', 'mixer'],
    ingredientTypes: ['syrup', 'garnish'],
    toolTypes: ['glass', 'silverware', 'ice'],
};

async function seedDefault() {
    await prisma.unit.createMany({
        data: [
            { name: 'ml', type: 'volume', base_unit: 'ml', multiplier: 1 },
            { name: 'oz', type: 'volume', base_unit: 'ml', multiplier: 29.5735 },
            { name: 'count', type: 'count', base_unit: 'count', multiplier: 1 }
        ],
        skipDuplicates: true,
    });

    await prisma.liquor_type.createMany({
        data: [
            { name: 'whiskey' }, 
            { name: 'gin' }, 
            { name: 'rum' },
            { name: 'vodka' },
            { name: 'tequila' },
            { name: 'brandy' },
            { name: 'liqueur' },
            { name: 'beer' }
        ],
        skipDuplicates: true,
    });

    await prisma.base_type.createMany({
        data: [
            { name: 'soda' },
            { name: 'juice' },
            { name: 'mixer' }
        ],
        skipDuplicates: true,
    });

    await prisma.ingredient_type.createMany({
        data: [
            { name: 'syrup' },
            { name: 'garnish' }
        ],
        skipDuplicates: true,
    });

    await prisma.tool_type.createMany({
        data: [
            { name: 'glass' },
            { name: 'silverware' },
            { name: 'ice' }
        ],
        skipDuplicates: true,
    });
}

async function ensureDefaults() {
    const missing = { units: [] as string[], liquorTypes: [] as string[], baseTypes: [] as string[], ingredientTypes: [] as string[], toolTypes: [] as string[] };

    // Units
    {
        interface Row {
            name: string;
        }
        const rows: Row[] = await prisma.unit.findMany({ where: { name: { in: REQUIRED.units } }, select: { name: true } });
        const have = new Set(rows.map((r: Row) => r.name));
        missing.units = REQUIRED.units.filter(x => !have.has(x));
        if (missing.units.length && process.env.SEED_CREATE_MISSING_DEFAULTS === 'true') {
            await prisma.unit.createMany({
                data: missing.units.map(n => ({ name: n, type: n === 'ml' ? 'volume' : 'count', base_unit: n, multiplier: 1 })),
                skipDuplicates: true,
            });
            missing.units = [];
        }
    }

    // Liquor types
    {
        interface Row {
            name: string;
        }
        const rows: Row[] = await prisma.liquor_type.findMany({ where: { name: { in: REQUIRED.liquorTypes } }, select: { name: true } });
        const have = new Set(rows.map((r: Row) => r.name));
        missing.liquorTypes = REQUIRED.liquorTypes.filter(x => !have.has(x));
        if (missing.liquorTypes.length && process.env.SEED_CREATE_MISSING_DEFAULTS === 'true') {
            await prisma.liquor_type.createMany({ data: missing.liquorTypes.map(name => ({ name })), skipDuplicates: true });
            missing.liquorTypes = [];
        }
    }

    // Base types
    {
        interface Row {
            name: string;
        }
        const rows: Row[] = await prisma.base_type.findMany({ where: { name: { in: REQUIRED.baseTypes } }, select: { name: true } });
        const have = new Set(rows.map((r: Row) => r.name));
        missing.baseTypes = REQUIRED.baseTypes.filter(x => !have.has(x));
        if (missing.baseTypes.length && process.env.SEED_CREATE_MISSING_DEFAULTS === 'true') {
            await prisma.base_type.createMany({ data: missing.baseTypes.map(name => ({ name })), skipDuplicates: true });
            missing.baseTypes = [];
        }
    }

    // Ingredient types
    {
        interface Row {
            name: string;
        }
        const rows: Row[] = await prisma.ingredient_type.findMany({ where: { name: { in: REQUIRED.ingredientTypes } }, select: { name: true } });
        const have = new Set(rows.map((r: Row) => r.name));
        missing.ingredientTypes = REQUIRED.ingredientTypes.filter(x => !have.has(x));
        if (missing.ingredientTypes.length && process.env.SEED_CREATE_MISSING_DEFAULTS === 'true') {
            await prisma.ingredient_type.createMany({ data: missing.ingredientTypes.map(name => ({ name })), skipDuplicates: true });
            missing.ingredientTypes = [];
        }
    }

    // Tool types
    {
        interface Row {
            name: string;
        }
        const rows: Row[] = await prisma.tool_type.findMany({ where: { name: { in: REQUIRED.toolTypes } }, select: { name: true } });
        const have = new Set(rows.map((r: Row) => r.name));
        missing.toolTypes = REQUIRED.toolTypes.filter(x => !have.has(x));
        if (missing.toolTypes.length && process.env.SEED_CREATE_MISSING_DEFAULTS === 'true') {
            await prisma.tool_type.createMany({ data: missing.toolTypes.map(name => ({ name })), skipDuplicates: true });
            missing.toolTypes = [];
        }
    }

    const stillMissing = Object.entries(missing).filter(([, arr]) => arr.length);
    if (stillMissing.length) {
        const msg = stillMissing.map(([k, arr]) => `- ${k}: [${arr.join(', ')}]`).join('\n');
        throw new Error(
            `Missing required defaults. Please seed these first (or re-run with SEED_CREATE_MISSING_DEFAULTS=true):\n${msg}`
        );
    }
}

async function seedDemo() {
    await ensureDefaults();

    // ---------- Transactions (ids are explicit because your schema has no autoincrement on Transaction.id)
    const t1 = await prisma.transaction.upsert({
        where: { id: 1001 },
        update: {},
        create: {
        id: 1001, item: 'Liquor purchase', brand: "Spec's", category: 'liquor',
        date: new Date('2025-03-10T18:00:00Z'), price: 120.45
        }
    });

    const t2 = await prisma.transaction.upsert({
        where: { id: 1002 },
        update: {},
        create: {
        id: 1002, item: 'Grocery run', brand: 'Local Market', category: 'ingredients',
        date: new Date('2025-03-11T20:00:00Z'), price: 38.10
        }
    });

    // ---------- Liquor catalog
    const whiskey = await prisma.liquor.upsert({
        where: { brand_name_mL: { brand: 'Wild Turkey', name: '101', mL: 750 } },
        update: { ABV: 50, img_path: '/img/liquor/wild_turkey_101_750.jpg', type: 'whiskey', present: true },
        create: { brand: 'Wild Turkey', name: '101', mL: 750, ABV: 50, img_path: '/img/liquor/wild_turkey_101_750.jpg', type: 'whiskey', present: true }
    });

    const gin = await prisma.liquor.upsert({
        where: { brand_name_mL: { brand: 'Tanqueray', name: 'London Dry', mL: 750 } },
        update: { ABV: 47, img_path: '/img/liquor/tanqueray_ld_750.jpg', type: 'gin', present: true },
        create: { brand: 'Tanqueray', name: 'London Dry', mL: 750, ABV: 47, img_path: '/img/liquor/tanqueray_ld_750.jpg', type: 'gin', present: true }
    });

    const vodka = await prisma.liquor.upsert({
        where: { brand_name_mL: { brand: "Tito's", name: 'Handmade Vodka', mL: 750 } },
        update: { ABV: 40, img_path: '/img/liquor/titos_750.jpg', type: 'vodka', present: true },
        create: { brand: "Tito's", name: 'Handmade Vodka', mL: 750, ABV: 40, img_path: '/img/liquor/titos_750.jpg', type: 'vodka', present: true }
    });

    // Liquor bottles (avoid duplicates by checking an existing bottle with same liquor + transaction)
    interface EnsureLiquorBottleParams {
        liquorId: number;
        transactionId: number;
        qty?: number;
    }

    async function ensureLiquorBottle(
        liquorId: number,
        transactionId: number,
        qty: number = 100
    ): Promise<void> {
        const exists = await prisma.liquor_bottle.findFirst({
            where: { liquor_id: liquorId, transaction_id: transactionId }
        });
        if (!exists) {
            await prisma.liquor_bottle.create({
                data: { liquor_id: liquorId, transaction_id: transactionId, quantity: qty }
            });
        }
    }
    await ensureLiquorBottle(whiskey.liquor_id, t1.id, 100);
    await ensureLiquorBottle(gin.liquor_id, t1.id, 100);
    await ensureLiquorBottle(vodka.liquor_id, t1.id, 100);

    // ---------- Bases (syrup / juice)
    // const simpleSyrup = await prisma.base.upsert({
    //     where: { brand_name_mL: { brand: 'House', name: 'Simple Syrup', mL: 750 } },
    //     update: { img_path: '/img/base/simple_syrup_750.jpg', type: 'syrup', present: true },
    //     create: { brand: 'House', name: 'Simple Syrup', mL: 750, img_path: '/img/base/simple_syrup_750.jpg', type: 'syrup', present: true }
    // });

    const lemonJuiceBase = await prisma.base.upsert({
        where: { brand_name_mL: { brand: 'Fresh', name: 'Lemon Juice', mL: 1000 } },
        update: { img_path: '/img/base/lemon_juice_1l.jpg', type: 'juice', present: true },
        create: { brand: 'Fresh', name: 'Lemon Juice', mL: 1000, img_path: '/img/base/lemon_juice_1l.jpg', type: 'juice', present: true }
    });

    interface EnsureBaseBottleParams {
        baseId: number;
        transactionId: number;
        qty?: number;
    }

    async function ensureBaseBottle(
        baseId: number,
        transactionId: number,
        qty: number = 100
    ): Promise<void> {
        const exists = await prisma.base_bottle.findFirst({ where: { base_id: baseId, transaction_id: transactionId } });
        if (!exists) {
            await prisma.base_bottle.create({ data: { base_id: baseId, transaction_id: transactionId, quantity: qty } });
        }
    }
    // await ensureBaseBottle(simpleSyrup.base_id, t2.id, 100);
    await ensureBaseBottle(lemonJuiceBase.base_id, t2.id, 100);

    // ---------- Ingredients (link to Unit + Ingredient_type)
    // const lemonIngredient = await prisma.ingredient.upsert({
    //     where: { name_quantity_unit: { name: 'lemon', quantity: 1, unit: 'count' } },
    //     update: { img_path: '/img/ingredient/lemon.jpg', type: 'citrus', present: true },
    //     create: { name: 'lemon', quantity: 1, unit: 'count', brand: null, type: 'citrus', img_path: '/img/ingredient/lemon.jpg', present: true }
    // });

    // const syrupIngredient = await prisma.ingredient.upsert({
    //     where: { name_quantity_unit: { name: 'simple syrup', quantity: 750, unit: 'ml' } },
    //     update: { img_path: '/img/ingredient/simple_syrup_750.jpg', type: 'sweetener', present: true },
    //     create: { name: 'simple syrup', quantity: 750, unit: 'ml', brand: 'House', type: 'sweetener', img_path: '/img/ingredient/simple_syrup_750.jpg', present: true }
    // });

    // Ingredient items (composite FK to Ingredient)
    async function ensureIngredientItem({
        brand,
        name,
        quantity,
        unit,
        transaction_id,
    }: {
        brand: string;
        name: string;
        quantity: number;
        unit: string;
        transaction_id: number;
    }) {
        const exists = await prisma.ingredient_item.findFirst({ where: { name, quantity, unit, transaction_id } });
        if (!exists) {
        await prisma.ingredient_item.create({ data: { brand, name, quantity, unit, transaction_id } });
        }
    }
    // await ensureIngredientItem({ brand: 'Local', name: lemonIngredient.name, quantity: lemonIngredient.quantity, unit: lemonIngredient.unit, transaction_id: t2.id });
    // await ensureIngredientItem({ brand: 'House', name: syrupIngredient.name, quantity: syrupIngredient.quantity, unit: syrupIngredient.unit, transaction_id: t2.id });

    // ---------- Tools
    // await prisma.tool.upsert({
    //     where: { name: 'rocks glass' },
    //     update: { transaction_id: t1.id, quantity: 2, unit: 'count', type: 'glassware' },
    //     create: { name: 'rocks glass', transaction_id: t1.id, quantity: 2, unit: 'count', type: 'glassware' }
    // });

    // ---------- Drinks & recipes
    // Drinks
    await prisma.drink.upsert({
        where: { name: 'Whiskey Sour' },
        update: {},
        create: { name: 'Whiskey Sour', img_path: '/img/drinks/whiskey_sour.jpg' }
    });
    await prisma.drink.upsert({
        where: { name: 'Gin & Tonic' },
        update: {},
        create: { name: 'Gin & Tonic', img_path: '/img/drinks/gin_tonic.jpg' }
    });
    await prisma.drink.upsert({
        where: { name: 'Espresso Martini' },
        update: {},
        create: { name: 'Espresso Martini', img_path: '/img/drinks/espresso_martini.jpg' }
    });

    // Recipes (composite unique on [name, ingredient])
    const wsWhiskey = await prisma.drink_recipe.upsert({
        where: { name_ingredient: { name: 'Whiskey Sour', ingredient: 'whiskey' } },
        update: { quantity: 60, unit: 'ml' },
        create: { name: 'Whiskey Sour', ingredient: 'whiskey', quantity: 60, unit: 'ml' }
    });
    await prisma.drink_recipe.upsert({
        where: { name_ingredient: { name: 'Whiskey Sour', ingredient: 'lemon juice' } },
        update: { quantity: 30, unit: 'ml' },
        create: { name: 'Whiskey Sour', ingredient: 'lemon juice', quantity: 30, unit: 'ml' }
    });
    await prisma.drink_recipe.upsert({
        where: { name_ingredient: { name: 'Whiskey Sour', ingredient: 'simple syrup' } },
        update: { quantity: 15, unit: 'ml' },
        create: { name: 'Whiskey Sour', ingredient: 'simple syrup', quantity: 15, unit: 'ml' }
    });

    await prisma.drink_recipe.upsert({
        where: { name_ingredient: { name: 'Gin & Tonic', ingredient: 'gin' } },
        update: { quantity: 60, unit: 'ml' },
        create: { name: 'Gin & Tonic', ingredient: 'gin', quantity: 60, unit: 'ml' }
    });
    await prisma.drink_recipe.upsert({
        where: { name_ingredient: { name: 'Gin & Tonic', ingredient: 'tonic water' } },
        update: { quantity: 120, unit: 'ml' },
        create: { name: 'Gin & Tonic', ingredient: 'tonic water', quantity: 120, unit: 'ml' }
    });

    await prisma.drink_recipe.upsert({
        where: { name_ingredient: { name: 'Espresso Martini', ingredient: 'vodka' } },
        update: { quantity: 60, unit: 'ml' },
        create: { name: 'Espresso Martini', ingredient: 'vodka', quantity: 60, unit: 'ml' }
    });
    await prisma.drink_recipe.upsert({
        where: { name_ingredient: { name: 'Espresso Martini', ingredient: 'coffee liqueur' } },
        update: { quantity: 30, unit: 'ml' },
        create: { name: 'Espresso Martini', ingredient: 'coffee liqueur', quantity: 30, unit: 'ml' }
    });
    await prisma.drink_recipe.upsert({
        where: { name_ingredient: { name: 'Espresso Martini', ingredient: 'espresso' } },
        update: { quantity: 30, unit: 'ml' },
        create: { name: 'Espresso Martini', ingredient: 'espresso', quantity: 30, unit: 'ml' }
    });

    // Variants (needs a drink_recipe.drink_id to anchor)
    const wsVariant = await prisma.drink_variant.upsert({
        where: { base_drink_variant_name: { base_drink: 'Whiskey Sour', variant_name: 'Gold Rush' } },
        update: { notes: 'Swap simple syrup for honey syrup.' },
        create: {
        base_drink: 'Whiskey Sour',
        variant_name: 'Gold Rush',
        img_overlay_path: null,
        notes: 'Swap simple syrup for honey syrup.',
        drink_id: wsWhiskey.drink_id // anchor to any Whiskey Sour recipe row
        }
    });

    // Variant ingredient mapping: simple syrup -> honey syrup
    await prisma.drink_variant_ingredient.upsert({
        where: { variant_id_original_ingredient: { variant_id: wsVariant.variant_id, original_ingredient: 'simple syrup' } },
        update: { replacement_ingredient: 'honey syrup' },
        create: { variant_id: wsVariant.variant_id, original_ingredient: 'simple syrup', replacement_ingredient: 'honey syrup' }
    });

    console.log('✅ Demo seed completed.');
}

async function main() {
  await seedDefault();

  // Gate demo fixtures
  if (process.env.SEED_DEMO === 'true' || process.env.NODE_ENV === 'test') {
    await seedDemo();
  }
}

main().catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());