import db from '../../config/db.js';

export const UnitModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM units');
        return result.rows;
    },
    
    async getByID(name) {
        const result = await db.query('SELECT * FROM units WHERE name = $1', [name]);
        return result.rows[0];
    },

    async create({ name, type, baseUnit, multiplier }) {
        const result = await db.query(`
            INSERT INTO units 
            (name, type, base_unit, multiplier) 
            VALUES ($1, $2, $3, $4) RETURNING *
        `, [name, type, baseUnit, multiplier]
        );
        return result.rows[0];
    },

    async update(name, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(name);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE units 
            SET ${setClause} 
            WHERE name = $${values.length}
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update unit in the model');
        }
        return result.rows[0];
    },

    async delete(name) {
        const result = await db.query('DELETE FROM units WHERE name = $1 RETURNING *', [name]);
        return result.rowCount;
    }
};