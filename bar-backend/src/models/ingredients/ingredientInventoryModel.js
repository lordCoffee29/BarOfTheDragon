import db from '../../config/db.js';

export const IngredientInventoryModel = {
    // Get all ingredient items with associated ingredient details
    async getAll() {
        const result = await db.query(`
            SELECT 
                ii.id as item_id,
                ii.ingredient_id,
                ii.transaction_id,
                ii.date_opened,
                ii.date_finished,
                i.brand,
                i.name,
                i.quantity as ingredient_quantity,
                i.unit,
                i.type,
                i.img_path,
                i.present,
                i.price
            FROM ingredient_item ii
            JOIN ingredient i ON ii.ingredient_id = i.id
            ORDER BY i.name, ii.date_opened DESC
        `);
        return result.rows;
    },

    // Get only active items (not finished)
    async getActive() {
        const result = await db.query(`
            SELECT 
                ii.id as item_id,
                ii.ingredient_id,
                ii.transaction_id,
                ii.date_opened,
                ii.date_finished,
                i.brand,
                i.name,
                i.quantity as ingredient_quantity,
                i.unit,
                i.type,
                i.img_path,
                i.present,
                i.price
            FROM ingredient_item ii
            JOIN ingredient i ON ii.ingredient_id = i.id
            WHERE ii.date_finished IS NULL
            ORDER BY i.name, ii.date_opened DESC
        `);
        return result.rows;
    },

    // Get all items of a specific ingredient
    async getByIngredientId(ingredientId) {
        const result = await db.query(`
            SELECT 
                ii.id as item_id,
                ii.ingredient_id,
                ii.transaction_id,
                ii.date_opened,
                ii.date_finished,
                i.brand,
                i.name,
                i.quantity as ingredient_quantity,
                i.unit,
                i.type,
                i.img_path,
                i.present,
                i.price
            FROM ingredient_item ii
            JOIN ingredient i ON ii.ingredient_id = i.id
            WHERE ii.ingredient_id = $1
            ORDER BY ii.date_opened DESC
        `, [ingredientId]);
        return result.rows;
    },
    
    // Get a specific item by its ID
    async getByID(itemId) {
        const result = await db.query(`
            SELECT 
                ii.id as item_id,
                ii.ingredient_id,
                ii.transaction_id,
                ii.date_opened,
                ii.date_finished,
                i.brand,
                i.name,
                i.quantity as ingredient_quantity,
                i.unit,
                i.type,
                i.img_path,
                i.present,
                i.price
            FROM ingredient_item ii
            JOIN ingredient i ON ii.ingredient_id = i.id
            WHERE ii.id = $1
        `, [itemId]);
        return result.rows[0];
    },

    // Create a new ingredient item with associated ingredient and type
    async create({ brand, name, quantity, unit, type, imgPath = null, present = true, price, transaction_id, date_opened = null }) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Check if type exists, if not create it
            const typeExists = await client.query('SELECT name FROM ingredient_type WHERE name = $1', [type]);
            if (typeExists.rows.length === 0) {
                await client.query('INSERT INTO ingredient_type (name) VALUES ($1)', [type]);
            }

            // Create ingredient entry
            const ingredientResult = await client.query(`
                INSERT INTO ingredient 
                (name, quantity, unit, brand, type, img_path, present, price) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
            `, [name, quantity, unit, brand, type, imgPath, present, price]);

            // Create ingredient_item entry
            const itemResult = await client.query(`
                INSERT INTO ingredient_item 
                (transaction_id, ingredient_id, date_opened, date_finished) 
                VALUES ($1, $2, $3, $4) RETURNING *
            `, [transaction_id, ingredientResult.rows[0].id, date_opened, null]);

            await client.query('COMMIT');
            
            // Return the complete item with ingredient details
            const result = await this.getByID(itemResult.rows[0].id);
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // Update an ingredient item and its associated ingredient/type
    async update(itemId, newValues) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Get the current item to retrieve ingredient_id
            const itemResult = await client.query('SELECT ingredient_id FROM ingredient_item WHERE id = $1', [itemId]);
            if (!itemResult.rows[0]) {
                throw new Error('Item not found');
            }
            const ingredientId = itemResult.rows[0].ingredient_id;

            // Separate fields by table
            const itemFields = {};
            const ingredientFields = {};
            
            const itemFieldNames = ['ingredient_id', 'transaction_id', 'date_opened', 'date_finished'];
            const ingredientFieldNames = ['brand', 'name', 'quantity', 'unit', 'img_path', 'present', 'price'];

            for (const [key, value] of Object.entries(newValues)) {
                if (itemFieldNames.includes(key)) {
                    itemFields[key] = value;
                } else if (ingredientFieldNames.includes(key)) {
                    ingredientFields[key] = value;
                }
            }

            // Update ingredient_type if type is being updated
            if (newValues.type) {
                // Check if type exists, if not create it
                const typeExists = await client.query('SELECT name FROM ingredient_type WHERE name = $1', [newValues.type]);
                if (typeExists.rows.length === 0) {
                    await client.query('INSERT INTO ingredient_type (name) VALUES ($1)', [newValues.type]);
                }
                ingredientFields.type = newValues.type;
            }

            // Update ingredient if there are ingredient fields
            if (Object.keys(ingredientFields).length > 0) {
                const fields = Object.keys(ingredientFields);
                const values = Object.values(ingredientFields);
                values.push(ingredientId);
                const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
                await client.query(
                    `UPDATE ingredient SET ${setClause} WHERE id = $${values.length}`,
                    values
                );
            }

            // Update ingredient_item if there are item fields
            if (Object.keys(itemFields).length > 0) {
                const fields = Object.keys(itemFields);
                const values = Object.values(itemFields);
                values.push(itemId);
                const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
                await client.query(
                    `UPDATE ingredient_item SET ${setClause} WHERE id = $${values.length}`,
                    values
                );
            }

            await client.query('COMMIT');

            // Return the updated item with ingredient details
            const result = await this.getByID(itemId);
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // Delete an ingredient item
    async deleteItem(itemId) {
        const result = await db.query('DELETE FROM ingredient_item WHERE id = $1 RETURNING *', [itemId]);
        return result.rowCount;
    },

    // Delete all items of a specific ingredient by ingredient_id
    async deleteByIngredientId(ingredientId) {
        const result = await db.query('DELETE FROM ingredient_item WHERE ingredient_id = $1 RETURNING *', [ingredientId]);
        return result.rowCount;
    },

    // Delete all items by ingredient name (handles multiple brands/sizes with same name)
    async deleteByIngredientName(name) {
        const result = await db.query(`
            DELETE FROM ingredient_item 
            WHERE ingredient_id IN (
                SELECT id FROM ingredient WHERE name = $1
            )
            RETURNING *
        `, [name]);
        return result.rowCount;
    },

    // Delete all items by exact ingredient match (name, quantity, unit)
    async deleteByExactIngredient(name, quantity, unit) {
        const result = await db.query(`
            DELETE FROM ingredient_item 
            WHERE ingredient_id = (
                SELECT id FROM ingredient 
                WHERE name = $1 AND quantity = $2 AND unit = $3
            )
            RETURNING *
        `, [name, quantity, unit]);
        return result.rowCount;
    }
};
