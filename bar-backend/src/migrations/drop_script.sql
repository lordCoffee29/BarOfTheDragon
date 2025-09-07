-- ======================
-- Drinks & recipes
-- ======================
-- DONE
DROP TABLE IF EXISTS drink_variant_ingredient CASCADE;
DROP TABLE IF EXISTS drink_variant CASCADE;
DROP TABLE IF EXISTS drink_recipe CASCADE;
DROP TABLE IF EXISTS drink CASCADE;

-- ======================
-- Tools
-- ======================
-- DONE
DROP TABLE IF EXISTS tool CASCADE;
DROP TABLE IF EXISTS tool_type CASCADE;

-- ======================
-- Ingredients
-- ======================
-- DONE
DROP TABLE IF EXISTS ingredient_item CASCADE;
DROP TABLE IF EXISTS ingredient CASCADE;
DROP TABLE IF EXISTS ingredient_type CASCADE;

-- ======================
-- Base
-- ======================
DROP TABLE IF EXISTS base_bottle CASCADE;
DROP TABLE IF EXISTS base CASCADE;
DROP TABLE IF EXISTS base_type CASCADE;

-- ======================
-- Liquor
-- ======================
DROP TABLE IF EXISTS liquor_bottle CASCADE;
DROP TABLE IF EXISTS liquor CASCADE;
DROP TABLE IF EXISTS liquor_type CASCADE;

-- ======================
-- Core reference tables
-- ======================
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS unit CASCADE;
