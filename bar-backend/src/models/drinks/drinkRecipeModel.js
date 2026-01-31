import db from '../../config/db.js';

export const DrinkRecipeModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM drink_recipe');
        return result.rows;
    },
    
    async getByID(drinkID) {
        const result = await db.query('SELECT * FROM drink_recipe WHERE id = $1', [drinkID]);
        return result.rows[0];
    },

    async create({ name, ingredient, quantity, unit}) {
        const result = await db.query(`
            INSERT INTO drink_recipe 
            (name, ingredient, quantity, unit) 
            VALUES ($1, $2, $3, $4) RETURNING *
        `, [name, ingredient, quantity, unit]
        );
        return result.rows[0];
    },

    async update(id, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(id);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE drink_recipe 
            SET ${setClause} 
            WHERE id = $${values.length}
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update drink recipe in the model');
        }
        return result.rows[0];
    },

    async delete(drinkID) {
        const result = await db.query('DELETE FROM drink_recipe WHERE id = $1 RETURNING *', [drinkID]);
        return result.rowCount;
    }
};