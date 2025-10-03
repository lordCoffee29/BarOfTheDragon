import db from '../../config/db.js';

export const BaseBottleModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM base_bottle');
        return result.rows;
    },
    
    async getByID(baseBottleID) {
        const result = await db.query('SELECT * FROM base_bottle WHERE id = $1', [baseBottleID]);
        return result.rows[0];
    },

    async create({ baseID, transactionID, dateOpened, dateFinished, quantity }) {
        const result = await db.query(`
            INSERT INTO base_bottle 
            (base_id, transaction_id, date_opened, date_finished, quantity) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [baseID, transactionID, dateOpened, dateFinished, quantity]
        );
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update base bottle in the model');
        }
        return result.rows[0];
    },

    async delete(baseBottleID) {
        const result = await db.query('DELETE FROM base_bottle WHERE id = $1 RETURNING *', [baseBottleID]);
        return result.rowCount;
    }
};