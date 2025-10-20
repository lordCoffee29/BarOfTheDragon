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

    async create({ brand, name, ml, abv, imgPath, type, present }) {
        const result = await db.query(`
            INSERT INTO ingredient 
            (brand, name, mL, ABV, img_path, type, present) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `, [brand, name, ml, abv, imgPath, type, present]
        );
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update liquor in the model');
        }
        return result.rows[0];
    },

    async delete(liquorID) {
        const result = await db.query('DELETE FROM liquor WHERE id = $1 RETURNING *', [liquorId]);
        return result.rowCount;
    }
};