import db from '../../config/db.js';

export const DrinkVariantModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM drink_variant');
        return result.rows;
    },
    
    async getByID(variantID) {
        const result = await db.query('SELECT * FROM drink_variant WHERE id = $1', [variantID]);
        return result.rows[0];
    },

    async create({ drinkID, baseDrink, variantName, imgOverlayPath, notes }) {
        const result = await db.query(`
            INSERT INTO drink_variant 
            (drink_id, base_drink, variant_name, img_overlay_path, notes) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [drinkID, baseDrink, variantName, imgOverlayPath, notes]
        );
        return result.rows[0];
    },

    async update(id, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(id);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE drink_variant 
            SET ${setClause} 
            WHERE id = $${values.length}
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update drink variant in the model');
        }
        return result.rows[0];
    },

    async delete(variantID) {
        const result = await db.query('DELETE FROM drink_variant WHERE id = $1 RETURNING *', [variantID]);
        return result.rowCount;
    }
};