import db from '../../config/db.js';


export const LiquorInventoryModel = {
    // Get all liquor bottles with associated liquor details
    async getAll() {
        const result = await db.query(`
            SELECT 
                lb.id as bottle_id,
                lb.liquor_id,
                lb.transaction_id,
                lb.date_opened,
                lb.date_finished,
                lb.quantity as bottle_quantity,
                l.brand,
                l.name,
                l.ml,
                l.abv,
                l.img_path,
                l.type,
                l.present,
                l.price
            FROM liquor_bottle lb
            JOIN liquor l ON lb.liquor_id = l.liquor_id
            ORDER BY l.name, lb.date_opened DESC
        `);
        return result.rows;
    },

    // Get only active bottles (not finished)
    async getActive() {
        const result = await db.query(`
            SELECT 
                lb.id as bottle_id,
                lb.liquor_id,
                lb.transaction_id,
                lb.date_opened,
                lb.date_finished,
                lb.quantity as bottle_quantity,
                l.brand,
                l.name,
                l.ml,
                l.abv,
                l.img_path,
                l.type,
                l.present,
                l.price
            FROM liquor_bottle lb
            JOIN liquor l ON lb.liquor_id = l.liquor_id
            WHERE lb.date_finished IS NULL
            ORDER BY l.name, lb.date_opened DESC
        `);
        return result.rows;
    },

    // Get all bottles of a specific liquor
    async getByLiquorId(liquorId) {
        const result = await db.query(`
            SELECT 
                lb.id as bottle_id,
                lb.liquor_id,
                lb.transaction_id,
                lb.date_opened,
                lb.date_finished,
                lb.quantity as bottle_quantity,
                l.brand,
                l.name,
                l.ml,
                l.abv,
                l.img_path,
                l.type,
                l.present,
                l.price
            FROM liquor_bottle lb
            JOIN liquor l ON lb.liquor_id = l.liquor_id
            WHERE lb.liquor_id = $1
            ORDER BY lb.date_opened DESC
        `, [liquorId]);
        return result.rows;
    },
    
    // Get a specific bottle by its ID
    async getByID(bottleId) {
        const result = await db.query(`
            SELECT 
                lb.id as bottle_id,
                lb.liquor_id,
                lb.transaction_id,
                lb.date_opened,
                lb.date_finished,
                lb.quantity as bottle_quantity,
                l.brand,
                l.name,
                l.ml,
                l.abv,
                l.img_path,
                l.type,
                l.present,
                l.price
            FROM liquor_bottle lb
            JOIN liquor l ON lb.liquor_id = l.liquor_id
            WHERE lb.id = $1
        `, [bottleId]);
        return result.rows[0];
    },

    // Create a new liquor bottle with associated liquor and type
    async create({ brand, name, ml, abv, imgPath = null, type, present = true, price, transaction_id, date_opened = null, quantity = 100 }) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Check if type exists, if not create it
            const typeExists = await client.query('SELECT name FROM liquor_type WHERE name = $1', [type]);
            if (typeExists.rows.length === 0) {
                await client.query('INSERT INTO liquor_type (name) VALUES ($1)', [type]);
            }

            // Create liquor entry
            const liquorResult = await client.query(`
                INSERT INTO liquor 
                (brand, name, ml, abv, img_path, type, present, price) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
            `, [brand, name, ml, abv, imgPath, type, present, price]);

            // Create bottle entry
            const bottleResult = await client.query(`
                INSERT INTO liquor_bottle 
                (liquor_id, transaction_id, date_opened, date_finished, quantity) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *
            `, [liquorResult.rows[0].liquor_id, transaction_id, date_opened, null, quantity]);

            await client.query('COMMIT');
            
            // Return the complete bottle with liquor details
            const result = await this.getByID(bottleResult.rows[0].id);
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // Update a liquor bottle and its associated liquor/type
    async update(bottleId, newValues) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Get the current bottle to retrieve liquor_id
            const bottleResult = await client.query('SELECT liquor_id FROM liquor_bottle WHERE id = $1', [bottleId]);
            if (!bottleResult.rows[0]) {
                throw new Error('Bottle not found');
            }
            const liquorId = bottleResult.rows[0].liquor_id;

            // Separate fields by table
            const bottleFields = {};
            const liquorFields = {};
            
            const bottleFieldNames = ['liquor_id', 'transaction_id', 'date_opened', 'date_finished', 'quantity'];
            const liquorFieldNames = ['brand', 'name', 'ml', 'abv', 'img_path', 'present', 'price'];

            for (const [key, value] of Object.entries(newValues)) {
                if (bottleFieldNames.includes(key)) {
                    bottleFields[key] = value;
                } else if (liquorFieldNames.includes(key)) {
                    liquorFields[key] = value;
                }
            }

            // Update liquor_type if type is being updated
            if (newValues.type) {
                // Check if type exists, if not create it
                const typeExists = await client.query('SELECT name FROM liquor_type WHERE name = $1', [newValues.type]);
                if (typeExists.rows.length === 0) {
                    await client.query('INSERT INTO liquor_type (name) VALUES ($1)', [newValues.type]);
                }
                liquorFields.type = newValues.type;
            }

            // Update liquor if there are liquor fields
            if (Object.keys(liquorFields).length > 0) {
                const fields = Object.keys(liquorFields);
                const values = Object.values(liquorFields);
                values.push(liquorId);
                const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
                await client.query(
                    `UPDATE liquor SET ${setClause} WHERE liquor_id = $${values.length}`,
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
                    `UPDATE liquor_bottle SET ${setClause} WHERE id = $${values.length}`,
                    values
                );
            }

            await client.query('COMMIT');

            // Return the updated bottle with liquor details
            const result = await this.getByID(bottleId);
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // Delete a liquor bottle
    async deleteBottle(bottleId) {
        const result = await db.query('DELETE FROM liquor_bottle WHERE id = $1 RETURNING *', [bottleId]);
        return result.rowCount;
    },

    // Delete all bottles of a specific liquor by liquor_id
    async deleteByLiquorId(liquorId) {
        const result = await db.query('DELETE FROM liquor_bottle WHERE liquor_id = $1 RETURNING *', [liquorId]);
        return result.rowCount;
    },

    // Delete all bottles by liquor name (handles multiple brands/sizes with same name)
    async deleteByLiquorName(name) {
        const result = await db.query(`
            DELETE FROM liquor_bottle 
            WHERE liquor_id IN (
                SELECT liquor_id FROM liquor WHERE name = $1
            )
            RETURNING *
        `, [name]);
        return result.rowCount;
    },

    // Delete all bottles by exact liquor match (brand, name, ml)
    async deleteByExactLiquor(brand, name, ml) {
        const result = await db.query(`
            DELETE FROM liquor_bottle 
            WHERE liquor_id = (
                SELECT liquor_id FROM liquor 
                WHERE brand = $1 AND name = $2 AND ml = $3
            )
            RETURNING *
        `, [brand, name, ml]);
        return result.rowCount;
    }
};