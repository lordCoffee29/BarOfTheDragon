import db from '../../config/db.js';

export const IngredientType = {
    async getAll() {
        const result = await db.query('SELECT * FROM ingredient_type');
        return result.rows;
    },
    
    async getByID(name) {
        const result = await db.query('SELECT * FROM ingredient_type WHERE name = $1', [name]);
        return result.rows[0];
    },

    async create({ name }) {
        const result = await db.query(`
            INSERT INTO ingredient_type 
            (name) 
            VALUES ($1) RETURNING *
        `, [name]
        );
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update ingredient_type in the model');
        }
        return result.rows[0];
    },

    async delete(name) {
        const result = await db.query('DELETE FROM ingredient_type WHERE id = $1 RETURNING *', [name]);
        return result.rowCount;
    }
};