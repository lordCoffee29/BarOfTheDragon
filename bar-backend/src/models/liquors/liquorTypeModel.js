import db from '../../config/db.js';

export const LiquorType = {
    async getAll() {
        const result = await db.query('SELECT * FROM liquor_type');
        return result.rows;
    },
    
    async getByID(name) {
        const result = await db.query('SELECT * FROM liquor_type WHERE name = $1', [name]);
        return result.rows[0];
    },

    async create({ name }) {
        const result = await db.query(`
            INSERT INTO liquor_type 
            (name) 
            VALUES ($1) RETURNING *
        `, [name]
        );
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update liquor_type in the model');
        }
        return result.rows[0];
    },

    async delete(name) {
        const result = await db.query('DELETE FROM liquor_type WHERE name = $1 RETURNING *', [name]);
        return result.rowCount;
    }
};