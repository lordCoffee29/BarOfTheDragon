import db from '../../config/db.js';

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ingredient_type (
        name  text PRIMARY KEY
      );
    `);
  } catch (error) {
    console.log(error)
  }
}

export async function down() {
  try {
    await db.query('DROP TABLE IF EXISTS ingredient_type');
  } catch (error) {
    console.log(error)
  }
}

up()