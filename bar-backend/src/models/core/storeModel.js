import db from '../../config/db.js';

export const StoreModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM store');
        return result.rows;
    },
    
    async getByID(address) {
        const result = await db.query('SELECT * FROM store WHERE address = $1', [address]);
        return result.rows[0];
    },

    async create({ address, name }) {
        const result = await db.query(`
            INSERT INTO store 
            (address, name) 
            VALUES ($1, $2) RETURNING *
        `, [address, name]
        );
        return result.rows[0];
    },

    async update(address, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(address);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE store 
            SET ${setClause} 
            WHERE address = $${values.length}
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update store in the model');
        }
        return result.rows[0];
    },

    async delete(address) {
        const result = await db.query('DELETE FROM store WHERE address = $1 RETURNING *', [address]);
        return result.rowCount;
    }
};