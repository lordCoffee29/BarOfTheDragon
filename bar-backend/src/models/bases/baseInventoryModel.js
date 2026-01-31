import db from '../../config/db.js';

export const BaseInventoryModel = {
    // Get all base bottles with associated base details
    async getAll() {
        const result = await db.query(`
            SELECT 
                bb.id as bottle_id,
                bb.base_id,
                bb.transaction_id,
                bb.date_opened,
                bb.date_finished,
                bb.quantity as bottle_quantity,
                b.brand,
                b.name,
                b.ml,
                b.img_path,
                b.type,
                b.present,
                b.price
            FROM base_bottle bb
            JOIN base b ON bb.base_id = b.id
            ORDER BY b.name, bb.date_opened DESC
        `);
        return result.rows;
    },

    // Get only active bottles (not finished)
    async getActive() {
        const result = await db.query(`
            SELECT 
                bb.id as bottle_id,
                bb.base_id,
                bb.transaction_id,
                bb.date_opened,
                bb.date_finished,
                bb.quantity as bottle_quantity,
                b.brand,
                b.name,
                b.ml,
                b.img_path,
                b.type,
                b.present,
                b.price
            FROM base_bottle bb
            JOIN base b ON bb.base_id = b.id
            WHERE bb.date_finished IS NULL
            ORDER BY b.name, bb.date_opened DESC
        `);
        return result.rows;
    },

    // Get all bottles of a specific base
    async getByBaseId(baseId) {
        const result = await db.query(`
            SELECT 
                bb.id as bottle_id,
                bb.base_id,
                bb.transaction_id,
                bb.date_opened,
                bb.date_finished,
                bb.quantity as bottle_quantity,
                b.brand,
                b.name,
                b.ml,
                b.img_path,
                b.type,
                b.present,
                b.price
            FROM base_bottle bb
            JOIN base b ON bb.base_id = b.id
            WHERE bb.base_id = $1
            ORDER BY bb.date_opened DESC
        `, [baseId]);
        return result.rows;
    },
    
    // Get a specific bottle by its ID
    async getByID(bottleId) {
        const result = await db.query(`
            SELECT 
                bb.id as bottle_id,
                bb.base_id,
                bb.transaction_id,
                bb.date_opened,
                bb.date_finished,
                bb.quantity as bottle_quantity,
                b.brand,
                b.name,
                b.ml,
                b.img_path,
                b.type,
                b.present,
                b.price
            FROM base_bottle bb
            JOIN base b ON bb.base_id = b.id
            WHERE bb.id = $1
        `, [bottleId]);
        return result.rows[0];
    },

    // Create a new base bottle with associated base and type
    async create({ brand, name, ml, imgPath = null, type, present = true, price, transaction_id, date_opened = null, quantity = 100 }) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Check if type exists, if not create it
            const typeExists = await client.query('SELECT name FROM base_type WHERE name = $1', [type]);
            if (typeExists.rows.length === 0) {
                await client.query('INSERT INTO base_type (name) VALUES ($1)', [type]);
            }

            // Create base entry
            const baseResult = await client.query(`
                INSERT INTO base 
                (brand, name, ml, img_path, type, present, price) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
            `, [brand, name, ml, imgPath, type, present, price]);

            // Create bottle entry
            const bottleResult = await client.query(`
                INSERT INTO base_bottle 
                (base_id, transaction_id, date_opened, date_finished, quantity) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *
            `, [baseResult.rows[0].id, transaction_id, date_opened, null, quantity]);

            await client.query('COMMIT');
            
            // Return the complete bottle with base details
            const result = await this.getByID(bottleResult.rows[0].id);
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // Update a base bottle and its associated base/type
    async update(bottleId, newValues) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Get the current bottle to retrieve base_id
            const bottleResult = await client.query('SELECT base_id FROM base_bottle WHERE id = $1', [bottleId]);
            if (!bottleResult.rows[0]) {
                throw new Error('Bottle not found');
            }
            const baseId = bottleResult.rows[0].base_id;

            // Separate fields by table
            const bottleFields = {};
            const baseFields = {};
            
            const bottleFieldNames = ['base_id', 'transaction_id', 'date_opened', 'date_finished', 'quantity'];
            const baseFieldNames = ['brand', 'name', 'ml', 'img_path', 'present', 'price'];

            for (const [key, value] of Object.entries(newValues)) {
                if (bottleFieldNames.includes(key)) {
                    bottleFields[key] = value;
                } else if (baseFieldNames.includes(key)) {
                    baseFields[key] = value;
                }
            }

            // Update base_type if type is being updated
            if (newValues.type) {
                // Check if type exists, if not create it
                const typeExists = await client.query('SELECT name FROM base_type WHERE name = $1', [newValues.type]);
                if (typeExists.rows.length === 0) {
                    await client.query('INSERT INTO base_type (name) VALUES ($1)', [newValues.type]);
                }
                baseFields.type = newValues.type;
            }

            // Update base if there are base fields
            if (Object.keys(baseFields).length > 0) {
                const fields = Object.keys(baseFields);
                const values = Object.values(baseFields);
                values.push(baseId);
                const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
                await client.query(
                    `UPDATE base SET ${setClause} WHERE id = $${values.length}`,
                    values
                );
            }

            // Update bottle if there are bottle fields
            if (Object.keys(bottleFields).length > 0) {
                const fields = Object.keys(bottleFields);
                const values = Object.values(bottleFields);
                values.push(bottleId);
                const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
                await client.query(
                    `UPDATE base_bottle SET ${setClause} WHERE id = $${values.length}`,
                    values
                );
            }

            await client.query('COMMIT');

            // Return the updated bottle with base details
            const result = await this.getByID(bottleId);
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // Delete a base bottle
    async deleteBottle(bottleId) {
        const result = await db.query('DELETE FROM base_bottle WHERE id = $1 RETURNING *', [bottleId]);
        return result.rowCount;
    },

    // Delete all bottles of a specific base by base_id
    async deleteByBaseId(baseId) {
        const result = await db.query('DELETE FROM base_bottle WHERE base_id = $1 RETURNING *', [baseId]);
        return result.rowCount;
    },

    // Delete all bottles by base name (handles multiple brands/sizes with same name)
    async deleteByBaseName(name) {
        const result = await db.query(`
            DELETE FROM base_bottle 
            WHERE base_id IN (
                SELECT id FROM base WHERE name = $1
            )
            RETURNING *
        `, [name]);
        return result.rowCount;
    },

    // Delete all bottles by exact base match (brand, name, ml)
    async deleteByExactBase(brand, name, ml) {
        const result = await db.query(`
            DELETE FROM base_bottle 
            WHERE base_id = (
                SELECT id FROM base 
                WHERE brand = $1 AND name = $2 AND ml = $3
            )
            RETURNING *
        `, [brand, name, ml]);
        return result.rowCount;
    }
};
