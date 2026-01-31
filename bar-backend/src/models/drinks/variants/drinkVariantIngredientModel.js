import db from '../../config/db.js';

export const DrinkVariantIngredientModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM drink_variant_ingredient');
        return result.rows;
    },
    
    async getByID(variantID, originalIngredient) {
        const result = await db.query('SELECT * FROM drink_variant_ingredient WHERE variant_id = $1 AND original_ingredient = $2', [variantID, originalIngredient]);
        return result.rows[0];
    },

    async create({ variantID, originalIngredient, replacementIngredient }) {
        const result = await db.query(`
            INSERT INTO drink_variant_ingredient 
            (variant_id, original_ingredient, replacement_ingredient) 
            VALUES ($1, $2, $3) RETURNING *
        `, [variantID, originalIngredient, replacementIngredient]
        );
        return result.rows[0];
    },

    async update(variantID, originalIngredient, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(variantID, originalIngredient);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE drink_variant_ingredient 
            SET ${setClause} 
            WHERE variant_id = $${values.length - 1} AND original_ingredient = $${values.length}
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update drink variant ingredient in the model');
        }
        return result.rows[0];
    },

    async delete(variantID, originalIngredient) {
        const result = await db.query('DELETE FROM drink_variant_ingredient WHERE variant_id = $1 AND original_ingredient = $2 RETURNING *', [variantID, originalIngredient]);
        return result.rowCount;
    }
};