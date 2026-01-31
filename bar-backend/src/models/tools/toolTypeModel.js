import db from '../../config/db.js';

export const ToolTypeModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM tool_type');
        return result.rows;
    },
    
    async getByID(name) {
        const result = await db.query('SELECT * FROM tool_type WHERE name = $1', [name]);
        return result.rows[0];
    },

    async create({ name }) {
        const result = await db.query(`
            INSERT INTO tool_type 
            (name) 
            VALUES ($1) RETURNING *
        `, [name]
        );
        return result.rows[0];
    },

    async update(name, newValues) {
        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(name);
        
        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        const query = `
            UPDATE tool_type 
            SET ${setClause} 
            WHERE name = $${values.length}
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update tool_type in the model');
        }
        return result.rows[0];
    },

    async delete(name) {
        const result = await db.query('DELETE FROM tool_type WHERE name = $1 RETURNING *', [name]);
        return result.rowCount;
    }
};