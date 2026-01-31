import db from '../../config/db.js';

export const IngredientModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM ingredient');
        return result.rows;
    },
    
    async getByID(ingredientID) {
        const result = await db.query('SELECT * FROM ingredient WHERE id = $1', [ingredientID]);
        return result.rows[0];
    },

    async create({ name, quantity, unit, brand, type, imgPath, present, price }) {
        const result = await db.query(`
            INSERT INTO ingredient 
            (name, quantity, unit, brand, type, img_path, present, price) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `, [name, quantity, unit, brand, type, imgPath, present, price]
        );
        return result.rows[0];
    },

    async update(id, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(id);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE ingredient 
            SET ${setClause} 
            WHERE id = $${values.length}
            RETURNING *
        `;
        
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