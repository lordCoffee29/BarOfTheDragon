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

    async create({ brand, name, ml, imgPath, type, present, price }) {
        const result = await db.query(`
            INSERT INTO base 
            (brand, name, ml, img_path, type, present, price) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `, [brand, name, ml, imgPath, type, present, price]
        );
        return result.rows[0];
    },

    async update(id, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(id);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE base 
            SET ${setClause} 
            WHERE id = $${values.length}
            RETURNING *
        `;
        
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