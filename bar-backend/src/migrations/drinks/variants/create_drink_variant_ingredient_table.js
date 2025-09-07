import db from '../../../config/db.js';

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS drink_variant_ingredient (
        variant_id              integer NOT NULL,
        original_ingredient     text NOT NULL,
        replacement_ingredient  text NOT NULL,
        CONSTRAINT drink_variant_ing_variant_fk
            FOREIGN KEY (variant_id) REFERENCES drink_variant(variant_id)
            ON UPDATE CASCADE ON DELETE RESTRICT,
        CONSTRAINT drink_variant_ingredient_pkey PRIMARY KEY (variant_id, original_ingredient)
        );
    `);
  } catch (error) {
    console.log(error)
  }
}

export async function down() {
  try {
    await db.query('DROP TABLE IF EXISTS drink_variant_ingredient');
  } catch (error) {
    console.log(error)
  }
}

up()