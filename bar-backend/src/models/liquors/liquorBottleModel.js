import db from '../../config/db.js';

export const LiquorBottleModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM liquor_bottle');
        return result.rows;
    },
    
    async getByID(liquorBottleID) {
        const result = await db.query('SELECT * FROM liquor_bottle WHERE id = $1', [liquorBottleID]);
        return result.rows[0];
    },

    async create({ liquorID, transactionID, dateOpened, dateFinished, quantity }) {
        const result = await db.query(`
            INSERT INTO liquor_bottle 
            (liquor_id, transaction_id, date_opened, date_finished, quantity) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [liquorID, transactionID, dateOpened, dateFinished, quantity]
        );
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update liquor_bottle item in the model');
        }
        return result.rows[0];
    },

    async delete(liquorBottleID) {
        const result = await db.query('DELETE FROM liquor_bottle WHERE id = $1 RETURNING *', [liquorBottleID]);
        return result.rowCount;
    }
};