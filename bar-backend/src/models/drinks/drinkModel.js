import db from '../../config/db.js';

export const DrinkModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM drink');
        return result.rows;
    },
    
    async getByID(name) {
        const result = await db.query('SELECT * FROM drink WHERE name = $1', [name]);
        return result.rows[0];
    },

    async create({ name, imgPath }) {
        const result = await db.query(`
            INSERT INTO drink 
            (name, img_path) 
            VALUES ($1, $2) RETURNING *
        `, [name, imgPath]
        );
        return result.rows[0];
    },

    async update(name, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(name);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE drink 
            SET ${setClause} 
            WHERE name = $${values.length}
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update drink in the model');
        }
        return result.rows[0];
    },

    async delete(name) {
        const result = await db.query('DELETE FROM drink WHERE name = $1 RETURNING *', [name]);
        return result.rowCount;
    }
};