import db from '../../config/db.js';

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS drink (
        name      text PRIMARY KEY,
        img_path  text NOT NULL
        );
    `);
  } catch (error) {
    console.log(error)
  }
}

export async function down() {
  try {
    await db.query('DROP TABLE IF EXISTS drink');
  } catch (error) {
    console.log(error)
  }
}

up()