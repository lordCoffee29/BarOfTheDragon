import db from '../../config/db.js';

export const ReceiptModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM receipt');
        return result.rows;
    },
    
    async getByID(id) {
        const result = await db.query('SELECT * FROM receipt WHERE id = $1', [id]);
        console.log(result.rows[0]);
        return result.rows[0]; 
    },

    async create({ date, createdAt }) {
        const result = await db.query(`
            INSERT INTO receipt 
            (date, created_at) 
            VALUES ($1, $2) RETURNING *
        `, [date, createdAt]
        );
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update receipt in the model');
        }
        return result.rows[0];
    },

    async delete(id) {
        const result = await db.query('DELETE FROM receipt WHERE id = $1 RETURNING *', [id]);
        return result.rowCount;
    }
};