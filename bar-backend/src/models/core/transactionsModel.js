import db from '../../config/db.js';

export const TransactionModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM transactions');
        return result.rows;
    },
    
    async getByID(transactionID) {
        const result = await db.query('SELECT * FROM transactions WHERE id = $1', [transactionID]);
        return result.rows[0];

    },

    async getByFilter(filters) {
        // const result = await db.query('SELECT * FROM transactions WHERE id = $1', [transactionID]);
        // return result.rows[0];

        const conditions = [];
        const values = [];
        let paramCount = 1;

        if (filters.item) {
            conditions.push(`item = $${paramCount++}`);
            values.push(filters.item);
        }
        if (filters.brand) {
            conditions.push(`brand = $${paramCount++}`);
            values.push(filters.brand);
        }
        if (filters.category) {
            conditions.push(`category = $${paramCount++}`);
            values.push(filters.category);
        }
        if (filters.date) {
            conditions.push(`date = $${paramCount++}`);
            values.push(filters.date);
        }   
        if (filters.price) {
            conditions.push(`price = $${paramCount++}`);
            values.push(filters.price);
        }

        console.log(filters);

        const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
        const result = await db.query(`SELECT * FROM transactions ${whereClause}`, values);
        
        return result.rows;

    },

    async getAutoPrice(item, brand) {

        console.log("Model: getAutoPrice called with:", { item, brand });
        const result = await db.query(
            'SELECT price FROM transactions WHERE item = $1 AND brand = $2',
            [item, brand]
        );
        
        console.log("Model: getAutoPrice result:", result.rows[0]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0].price;
        
    },

    async create({ receipt_id, line_num, item, brand, category, date, price, note, created_at, updated_at }) {
        console.log("Model: create called with:", { receipt_id, line_num, item, brand, category, date, price, note });

        const result = await db.query(`
            INSERT INTO transactions 
            (receipt_id, line_num, item, brand, category, date, price, note, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `, [receipt_id, line_num, item, brand, category, date, price, note, created_at, updated_at]
        );
        console.log("Model: create result:", result.rows[0]);
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
        const result = await db.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [transactionID]);
        return result.rowCount;
    }
};