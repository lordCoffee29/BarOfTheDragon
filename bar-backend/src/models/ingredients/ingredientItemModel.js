import db from '../../config/db.js';

export const IngredientItemModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM ingredient_item');
        return result.rows;
    },
    
    async getByID(ingredientItemID) {
        const result = await db.query('SELECT * FROM ingredient_item WHERE id = $1', [ingredientItemID]);
        return result.rows[0];
    },

    async create({ transactionID, ingredientID, dateOpened, dateFinished }) {
        const result = await db.query(`
            INSERT INTO ingredient_item 
            (transaction_id, ingredient_id, date_opened, date_finished) 
            VALUES ($1, $2, $3, $4) RETURNING *
        `, [transactionID, ingredientID, dateOpened, dateFinished]
        );
        return result.rows[0];
    },

    async update(id, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(id);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE ingredient_item 
            SET ${setClause} 
            WHERE id = $${values.length}
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update ingredient item in the model');
        }
        return result.rows[0];
    },

    async delete(ingredientID) {
        const result = await db.query('DELETE FROM ingredient_item WHERE id = $1 RETURNING *', [ingredientID]);
        return result.rowCount;
    }
};