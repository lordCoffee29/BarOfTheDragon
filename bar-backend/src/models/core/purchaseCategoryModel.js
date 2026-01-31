import db from '../../config/db.js';

export const PurchaseCategorytModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM purchase_category');
        return result.rows;
    },
    
    async getByID(name) {
        const result = await db.query('SELECT * FROM purchase_category WHERE name = $1', [name]);
        return result.rows[0];
    },

    async create({ name }) {
        const result = await db.query(`
            INSERT INTO purchase_category 
            (name) 
            VALUES ($1) RETURNING *
        `, [name]
        );
        return result.rows[0];
    },

    async update(name, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(name);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE purchase_category 
            SET ${setClause} 
            WHERE name = $${values.length}
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update purchase category in the model');
        }
        return result.rows[0];
    },

    async delete(name) {
        const result = await db.query('DELETE FROM purchase_category WHERE name = $1 RETURNING *', [name]);
        return result.rowCount;
    }
};