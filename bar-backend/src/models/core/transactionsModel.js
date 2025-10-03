import db from '../../config/db.js';

export const TransactionModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM Transactions');
        return result.rows;
    },
    
    async getByID(transactionID) {
        const result = await db.query('SELECT * FROM Transactions WHERE id = $1', [transactionID]);
        return result.rows[0];
    },

    async create({ item, brand, category, date, price }) {
        const result = await db.query(`
            INSERT INTO Transactions 
            (item, brand, category, date, price) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [item, brand, category, date, price]
        );
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update transaction in the model');
        }
        return result.rows[0];
    },

    async delete(transactionID) {
        const result = await db.query('DELETE FROM Transactions WHERE id = $1 RETURNING *', [transactionID]);
        return result.rowCount;
    }
};