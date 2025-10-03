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

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update drink recipe in the model');
        }
        return result.rows[0];
    },

    async delete(drinkID) {
        const result = await db.query('DELETE FROM drink WHERE id = $1 RETURNING *', [drinkID]);
        return result.rowCount;
    }
};