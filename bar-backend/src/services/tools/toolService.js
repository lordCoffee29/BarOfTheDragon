import db from '../../database/db.js';

export const TransactionsModel = {
    async getAll() {
        const transactions = await db.query('SELECT * FROM transactions ORDER BY date DESC');
        return transactions.rows;
    },

    async getByID(transactionID) {
        const transaction = await db.query('SELECT * FROM transactions WHERE id = $1', [transactionID]);
        return transaction.rows[0];
    },
}
