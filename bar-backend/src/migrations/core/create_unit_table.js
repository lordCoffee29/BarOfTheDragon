import db from '../../config/db.js';

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS unit (
        name         text PRIMARY KEY,
        unit_type    text NOT NULL,
        base_unit    text NOT NULL,
        multiplier   double precision NOT NULL
        );
    `);
  } catch (error) {
    console.log(error)
  }
}

export async function down() {
  try {
    await db.query('DROP TABLE IF EXISTS unit');
  } catch (error) {
    console.log(error)
  }
}

up()