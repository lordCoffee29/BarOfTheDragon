import db from '../../config/db.js';

export const ToolModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM tool');
        return result.rows;
    },
    
    async getByID(toolID) {
        const result = await db.query('SELECT * FROM tool WHERE id = $1', [toolID]);
        return result.rows[0];
    },

    async create({ name, transactionID, quantity, unit, type, price }) {
        const result = await db.query(`
            INSERT INTO tool 
            (name, transaction_id, quantity, unit, type, price) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `, [name, transactionID, quantity, unit, type, price]
        );
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update tool in the model');
        }
        return result.rows[0];
    },

    async delete(name) {
        const result = await db.query('DELETE FROM tool WHERE name = $1 RETURNING *', [name]);
        return result.rowCount;
    }
};