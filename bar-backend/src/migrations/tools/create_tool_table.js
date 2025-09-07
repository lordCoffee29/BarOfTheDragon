import db from '../../config/db.js';

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS tool (
        name             text PRIMARY KEY,
        transaction_id   integer NOT NULL,
        quantity         integer NOT NULL,
        unit             text NOT NULL,
        tool_type_name   text NOT NULL,
        CONSTRAINT tool_type_fk
            FOREIGN KEY (tool_type_name) REFERENCES tool_type(name)
            ON UPDATE CASCADE ON DELETE RESTRICT,
        CONSTRAINT tool_unit_fk
            FOREIGN KEY (unit) REFERENCES unit(name)
            ON UPDATE CASCADE ON DELETE RESTRICT,
        CONSTRAINT tool_txn_fk
            FOREIGN KEY (transaction_id) REFERENCES transactions(id)
            ON UPDATE CASCADE ON DELETE RESTRICT
        );
    `);
  } catch (error) {
    console.log(error)
  }
}

export async function down() {
  try {
    await db.query('DROP TABLE IF EXISTS tool');
  } catch (error) {
    console.log(error)
  }
}

up()