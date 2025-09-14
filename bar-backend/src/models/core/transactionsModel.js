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

    async update(transactionID, { item, brand, category, date, price }) {
        // const result = await db.query(`
        //     UPDATE Transactions 
        //     SET item = $1, brand = $2, category = $3, date = $4, price = $5 
        //     WHERE id = $6 RETURNING *
        // `, [item, brand, category, date, price, transactionID]
        // );
        // return result.rows[0];

        // Placeholder code, fix later
    },

    async delete(transactionID) {
        const result = await db.query('DELETE FROM Transactions WHERE id = $1 RETURNING *', [transactionID]);
        return result.rowsCount;
    }
};