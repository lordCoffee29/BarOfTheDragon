import db from '../../config/db.js';

export const LiquorModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM liquor');
        return result.rows;
    },
    
    async getByID(liquorID) {
        const result = await db.query('SELECT * FROM liquor WHERE liquor_id = $1', [liquorID]);
        return result.rows[0];
    },

    async create({ brand, name, ml, abv, imgPath, type, present, price }) {
        const result = await db.query(`
            INSERT INTO liquor 
            (brand, name, ml, abv, img_path, type, present, price) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `, [brand, name, ml, abv, imgPath, type, present, price]
        );
        return result.rows[0];
    },

    async update(id, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(id);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE liquor 
            SET ${setClause} 
            WHERE liquor_id = $${values.length}
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update liquor in the model');
        }
        return result.rows[0];
    },

    async delete(liquorID) {
        const result = await db.query('DELETE FROM liquor WHERE liquor_id = $1 RETURNING *', [liquorID]);
        return result.rowCount;
    }
};