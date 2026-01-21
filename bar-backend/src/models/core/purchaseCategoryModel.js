import db from '../../config/db.js';

export const PurchaseCategorytModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM purchase_category');
        return result.rows;
    },
    
    async getByID(name) {
        const result = await db.query('SELECT * FROM purchase_category WHERE name = $1', [name]);
        return result.rows[0];
    },

    async create({ name, type, baseUnit, multiplier }) {
        const result = await db.query(`
            INSERT INTO purchase_category 
            (name) 
            VALUES ($1) RETURNING *
        `, [name]
        );
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update unit in the model');
        }
        return result.rows[0];
    },

    async delete(name) {
        const result = await db.query('DELETE FROM Units WHERE name = $1 RETURNING *', [name]);
        return result.rowCount;
    }
};