import db from '../../config/db.js';

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS liquor_type (
        name  text PRIMARY KEY
      );
    `);
  } catch (error) {
    console.log(error)
  }
}

export async function down() {
  try {
    await db.query('DROP TABLE IF EXISTS liquor_type');
  } catch (error) {
    console.log(error)
  }
}

up()