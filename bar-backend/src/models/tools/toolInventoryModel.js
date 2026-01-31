import db from '../../config/db.js';

export const ToolInventoryModel = {
    // Get all tools with their details
    async getAll() {
        const result = await db.query(`
            SELECT 
                t.name,
                t.transaction_id,
                t.quantity,
                t.unit,
                t.type,
                t.price
            FROM tool t
            ORDER BY t.name
        `);
        return result.rows;
    },

    // Get tools by type
    async getByType(type) {
        const result = await db.query(`
            SELECT 
                t.name,
                t.transaction_id,
                t.quantity,
                t.unit,
                t.type,
                t.price
            FROM tool t
            WHERE t.type = $1
            ORDER BY t.name
        `, [type]);
        return result.rows;
    },
    
    // Get a specific tool by its name
    async getByID(toolName) {
        const result = await db.query(`
            SELECT 
                t.name,
                t.transaction_id,
                t.quantity,
                t.unit,
                t.type,
                t.price
            FROM tool t
            WHERE t.name = $1
        `, [toolName]);
        return result.rows[0];
    },

    // Create a new tool with associated type
    async create({ name, transaction_id, quantity, unit, type, price }) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Check if type exists, if not create it
            const typeExists = await client.query('SELECT name FROM tool_type WHERE name = $1', [type]);
            if (typeExists.rows.length === 0) {
                await client.query('INSERT INTO tool_type (name) VALUES ($1)', [type]);
            }

            // Create tool entry
            const toolResult = await client.query(`
                INSERT INTO tool 
                (name, transaction_id, quantity, unit, type, price) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
            `, [name, transaction_id, quantity, unit, type, price]);

            await client.query('COMMIT');
            
            // Return the created tool
            return toolResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // Update a tool and its associated type
    async update(toolName, newValues) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Update tool_type if type is being updated
            if (newValues.type) {
                // Check if type exists, if not create it
                const typeExists = await client.query('SELECT name FROM tool_type WHERE name = $1', [newValues.type]);
                if (typeExists.rows.length === 0) {
                    await client.query('INSERT INTO tool_type (name) VALUES ($1)', [newValues.type]);
                }
            }

            // Update tool
            const fields = Object.keys(newValues);
            const values = Object.values(newValues);
            values.push(toolName);
            
            const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
            
            const result = await client.query(
                `UPDATE tool SET ${setClause} WHERE name = $${values.length} RETURNING *`,
                values
            );

            await client.query('COMMIT');

            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // Delete a tool
    async delete(toolName) {
        const result = await db.query('DELETE FROM tool WHERE name = $1 RETURNING *', [toolName]);
        return result.rowCount;
    },

    // Delete all tools by type
    async deleteByType(type) {
        const result = await db.query('DELETE FROM tool WHERE type = $1 RETURNING *', [type]);
        return result.rowCount;
    }
};
