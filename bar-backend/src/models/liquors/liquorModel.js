import db from '../../config/db.js';

export const LiquorModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM liquor');
        return result.rows;
    },
    
    async getByID(liquorID) {
        const result = await db.query('SELECT * FROM liquor WHERE id = $1', [liquorID]);
        return result.rows[0];
    },

    async create({ name, quantity, unit, brand, type, imgPath, present }) {
        const result = await db.query(`
            INSERT INTO ingredient 
            (name, quantity, unit, brand, type, img_path, present) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `, [name, quantity, unit, brand, type, imgPath, present]
        );
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update ingredient in the model');
        }
        return result.rows[0];
    },

    async delete(ingredientID) {
        const result = await db.query('DELETE FROM ingredient WHERE id = $1 RETURNING *', [ingredientID]);
        return result.rowCount;
    }
};