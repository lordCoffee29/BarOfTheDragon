import db from '../../config/db.js';

export const ReceiptModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM receipt');
        return result.rows;
    },
    
    async getByID(id) {
        const result = await db.query('SELECT * FROM receipt WHERE id = $1', [id]);
        return result.rows[0]; 
    },

    async create({ date }) {
        const result = await db.query(`
            INSERT INTO receipt 
            (date) 
            VALUES ($1) RETURNING *
        `, [date]
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await db.query('DELETE FROM receipt WHERE id = $1 RETURNING *', [id]);
        return result.rowCount;
    }
};