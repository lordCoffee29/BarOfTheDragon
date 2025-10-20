import db from '../../config/db.js';

export const BaseModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM base');
        return result.rows;
    },
    
    async getByID(baseID) {
        const result = await db.query('SELECT * FROM base WHERE id = $1', [baseID]);
        return result.rows[0];
    },

    async create({ brand, name, mL, imgPath, type, present }) {
        const result = await db.query(`
            INSERT INTO base_bottle 
            (brand, name, ml, img_path, type, present) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `, [brand, name, ml, imgPath, type, present]
        );
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update base in the model');
        }
        return result.rows[0];
    },

    async delete(baseID) {
        const result = await db.query('DELETE FROM base WHERE id = $1 RETURNING *', [baseID]);
        return result.rowCount;
    }
};