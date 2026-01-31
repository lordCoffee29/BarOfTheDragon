
import db from '../../config/db.js';

export const TransactionViewModel = {
    // Add a complete receipt with multiple line items
    async addPurchase(receiptData) {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const { storeLoc, storeName, date, lineItems } = receiptData;

            // Create store if it doesn't exist
            const storeExists = await client.query('SELECT address FROM store WHERE address = $1', [storeLoc]);
            if (storeExists.rows.length === 0) {
                await client.query('INSERT INTO store (address, name) VALUES ($1, $2)', [storeLoc, storeName]);
            }

            // Create receipt
            const receiptResult = await client.query(
                'INSERT INTO receipt (date, store_loc) VALUES ($1, $2) RETURNING *',
                [date, storeLoc]
            );
            const receiptId = receiptResult.rows[0].id;

            // Process each line item
            for (let i = 0; i < lineItems.length; i++) {
                const lineItem = lineItems[i];
                const lineNum = i + 1;
                const category = lineItem.category;

                // Create purchase category if it doesn't exist
                const categoryExists = await client.query('SELECT name FROM purchase_category WHERE name = $1', [category]);
                if (categoryExists.rows.length === 0) {
                    await client.query('INSERT INTO purchase_category (name) VALUES ($1)', [category]);
                }

                // Create transaction
                const transactionResult = await client.query(`
                    INSERT INTO transactions 
                    (receipt_id, line_num, item, brand, category, date, price, quantity, pack_size, note)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    RETURNING *
                `, [
                    receiptId,
                    lineNum,
                    lineItem.item,
                    lineItem.brand || null,
                    category,
                    date,
                    lineItem.price,
                    lineItem.quantity || 1,
                    lineItem.packSize || null,
                    lineItem.note || null
                ]);

                const transactionId = transactionResult.rows[0].id;

                // Create inventory entries based on category
                if (category === 'Liquor') {
                    const { item, brand, ml, abv, type, price, imgPath } = lineItem;
                    
                    // Check if type exists
                    const typeExists = await client.query('SELECT name FROM liquor_type WHERE name = $1', [type]);
                    if (typeExists.rows.length === 0) {
                        await client.query('INSERT INTO liquor_type (name) VALUES ($1)', [type]);
                    }

                    // Create liquor
                    const liquorResult = await client.query(`
                        INSERT INTO liquor (brand, name, ml, abv, img_path, type, present, price)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        ON CONFLICT (brand, name, ml) DO UPDATE SET price = EXCLUDED.price
                        RETURNING liquor_id
                    `, [brand, item, ml, abv, imgPath || '', type, true, price]);

                    // Create liquor_bottle
                    await client.query(`
                        INSERT INTO liquor_bottle (liquor_id, transaction_id, quantity)
                        VALUES ($1, $2, $3)
                    `, [liquorResult.rows[0].liquor_id, transactionId, 100]);

                } else if (category === 'Base') {
                    const { item, brand, ml, type, price, imgPath } = lineItem;
                    
                    // Check if type exists
                    const typeExists = await client.query('SELECT name FROM base_type WHERE name = $1', [type]);
                    if (typeExists.rows.length === 0) {
                        await client.query('INSERT INTO base_type (name) VALUES ($1)', [type]);
                    }

                    // Create base
                    const baseResult = await client.query(`
                        INSERT INTO base (brand, name, ml, img_path, type, present, price)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        ON CONFLICT (brand, name, ml) DO UPDATE SET price = EXCLUDED.price
                        RETURNING id
                    `, [brand, item, ml, imgPath || '', type, true, price]);

                    // Create base_bottle
                    await client.query(`
                        INSERT INTO base_bottle (base_id, transaction_id, quantity)
                        VALUES ($1, $2, $3)
                    `, [baseResult.rows[0].id, transactionId, 100]);

                } else if (category === 'Ingredient') {
                    const { item, brand, quantity, unit, type, price, imgPath } = lineItem;
                    
                    // Check if type exists
                    const typeExists = await client.query('SELECT name FROM ingredient_type WHERE name = $1', [type]);
                    if (typeExists.rows.length === 0) {
                        await client.query('INSERT INTO ingredient_type (name) VALUES ($1)', [type]);
                    }

                    // Create ingredient
                    const ingredientResult = await client.query(`
                        INSERT INTO ingredient (name, quantity, unit, brand, type, img_path, present, price)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        ON CONFLICT (name, quantity, unit) DO UPDATE SET price = EXCLUDED.price
                        RETURNING id
                    `, [item, quantity, unit, brand, type, imgPath || '', true, price]);

                    // Create ingredient_item
                    await client.query(`
                        INSERT INTO ingredient_item (transaction_id, ingredient_id)
                        VALUES ($1, $2)
                    `, [transactionId, ingredientResult.rows[0].id]);

                } else if (category === 'Tool') {
                    const { item, quantity, unit, type, price } = lineItem;
                    
                    // Check if type exists
                    const typeExists = await client.query('SELECT name FROM tool_type WHERE name = $1', [type]);
                    if (typeExists.rows.length === 0) {
                        await client.query('INSERT INTO tool_type (name) VALUES ($1)', [type]);
                    }

                    // Create tool
                    await client.query(`
                        INSERT INTO tool (name, transaction_id, quantity, unit, type, price)
                        VALUES ($1, $2, $3, $4, $5, $6)
                    `, [item, transactionId, quantity, unit, type, price]);
                }
                // Tax and Fee categories don't create inventory entries
            }

            await client.query('COMMIT');
            return receiptResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async getList() {
        const result = await db.query('SELECT item, brand, category, date, price FROM transactions');
        return result.rows;
    },
    
    async getByID(transactionID, mode) {
        // const result = await db.query('SELECT * FROM transactions WHERE id = $1', [transactionID]);
        // return result.rows[0];

        let query = null;

        if (mode === "Liquor") {
            query = `
                SELECT 
                    t.item,
                    t.pack_size,
                    t.brand,
                    l.mL,
                    l.ABV,
                    l.type,
                    t.date,
                    t.quantity,
                    t.price,
                    t.category,
                    r.date AS receipt_date
                FROM transactions t
                INNER JOIN liquor_bottle lb ON t.id = lb.transaction_id
                INNER JOIN liquor l ON lb.liquor_id = l.liquor_id
                INNER JOIN receipt r ON t.receipt_id = r.id
                WHERE t.id = $1
            `;
        } else if (mode === "Base") {
            query = `
                SELECT 
                    t.item,
                    t.pack_size,
                    t.brand,
                    b.mL,
                    b.type,
                    t.date,
                    t.quantity,
                    t.price,
                    t.category,
                    r.date AS receipt_date
                FROM transactions t
                INNER JOIN base_bottle bb ON t.id = bb.transaction_id
                INNER JOIN base b ON bb.base_id = b.id
                INNER JOIN receipt r ON t.receipt_id = r.id
                WHERE t.id = $1
            `;

        } else if (mode == "Ingredient") {
            query = `
                SELECT 
                    t.item,
                    t.pack_size,
                    t.brand,
                    i.quantity,
                    i.unit,
                    i.type,
                    t.date,
                    t.quantity,
                    t.price,
                    t.category,
                    r.date AS receipt_date
                FROM transactions t
                INNER JOIN ingredient_item ii ON t.id = ii.transaction_id
                INNER JOIN ingredient i ON ii.ingredient_id = i.id
                INNER JOIN receipt r ON t.receipt_id = r.id
                WHERE t.id = $1
            `;
        } else if (mode == "Tool") {
            query = `
                SELECT 
                    t.item,
                    t.pack_size,
                    t.brand,
                    tl.quantity,
                    tl.unit,
                    tl.type,
                    t.date,
                    t.quantity,
                    t.price,
                    t.category,
                    r.date AS receipt_date
                FROM transactions t
                INNER JOIN tool tl ON t.id = tl.transaction_id
                INNER JOIN receipt r ON t.receipt_id = r.id
                WHERE t.id = $1
            `;
        }

        const result = await db.query(query, [transactionID])
        console.log(result);
        return result.rows[0];

    },

    async getByFilterAndSort(filters) {
        // const result = await db.query('SELECT * FROM transactions WHERE id = $1', [transactionID]);
        // return result.rows[0];

        //id, item, brand, category, dateStart, dateEnd, dateDir, priceMin, priceMax, priceDir, sortBy, sortOrder

        const conditions = [];
        const sort = [];
        const values = [];
        let paramCount = 1;

        if (filters.item) {
            conditions.push(`item = $${paramCount++}`);
            values.push(filters.item);
        }

        if (filters.brand) {
            conditions.push(`brand = $${paramCount++}`);
            values.push(filters.brand);
        }

        if (filters.category) {
            conditions.push(`category = $${paramCount++}`);
            values.push(filters.category);
        }

        // Always exclude Tax and Fee categories
        conditions.push(`category NOT IN ('Tax', 'Fee')`);

        if (filters.dateStart && filters.dateEnd && filters.dateDir) {
            if (filters.dateDir === 'in') {
                conditions.push(`date::timestamp >= $${paramCount++}::timestamp AND date::timestamp <= $${paramCount++}::timestamp`);
                values.push(filters.dateStart, filters.dateEnd);
            } else if (filters.dateDir === 'out') {
                conditions.push(`date::timestamp <= $${paramCount++}::timestamp OR date::timestamp >= $${paramCount++}::timestamp`);
                values.push(filters.dateStart, filters.dateEnd);
            }
        } 

        if (filters.dateStart && !filters.dateEnd) {
            conditions.push(`date::timestamp >= $${paramCount++}::timestamp`);
            values.push(filters.dateStart);
        }

        if (!filters.dateStart && filters.dateEnd) {
            conditions.push(`date::timestamp <= $${paramCount++}::timestamp`);
            values.push(filters.dateEnd);
        }

        if (filters.priceMin && filters.priceMax && filters.priceDir) {
            if (filters.priceDir === 'in') {
                conditions.push(`price >= $${paramCount++} AND price <= $${paramCount++}`);
                values.push(filters.priceMin, filters.priceMax);
            } else if (filters.priceDir === 'out') {
                conditions.push(`price <= $${paramCount++} OR price >= $${paramCount++}`);
                values.push(filters.priceMin, filters.priceMax);
            }
        } 

        if (filters.priceMin && !filters.priceMax) {
            conditions.push(`price >= $${paramCount++}`);
            values.push(filters.priceMin);
        }

        if (!filters.priceMin && filters.priceMax) {
            conditions.push(`price <= $${paramCount++}`);
            values.push(filters.priceMax);
        }

        if (filters.sortBy && filters.sortOrder) {
            sort.push(`${filters.sortBy} ${filters.sortOrder}, id ASC`);
        }

        if (filters.sortBy && !filters.sortOrder) {
            sort.push(`${filters.sortBy} ASC, id ASC`);
        }

        if (!filters.sortBy && filters.sortOrder) {
            sort.push(`id ${filters.sortOrder}`);
        }

        if (!filters.sortBy && !filters.sortOrder) {
            sort.push(`id ASC`);
        }

        console.log(conditions);
        console.log(sort);

        const whereClause = conditions.length > 0 ? 'WHERE category NOT IN (\'Tax\', \'Fee\') AND ' + conditions.join(' AND ') : '';
        const sortClause = sort.length > 0 ? 'ORDER BY ' + sort[0] : 'ORDER BY id ASC';

        console.log("Model: clauses: ");
        console.log('WHERE clause:', whereClause);
        console.log('SORT clause:', sortClause);


        const result = await db.query(`SELECT * FROM transactions ${whereClause} ${sortClause}`, values);
        
        return result.rows;

    },

    async getAutoPrice(item, brand) {

        console.log("Model: getAutoPrice called with:", { item, brand });
        const result = await db.query(
            'SELECT price FROM transactions WHERE item = $1 AND brand = $2',
            [item, brand]
        );
        
        console.log("Model: getAutoPrice result:", result.rows[0]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0].price;
        
    },


    async getSorted(sortBy, sortOrder) {
        const result = await db.query(`SELECT * FROM transactions ORDER BY ${sortBy} ${sortOrder}`);
        return result.rows;
    },

    // ============================================================================
    // RECEIPT OPERATIONS
    // ============================================================================

    // Get all receipts with summary information
    async getAllReceipts() {
        const result = await db.query(`
            SELECT 
                r.id,
                r.date,
                r.store_loc,
                s.name as store_name,
                COUNT(t.id) as transaction_count,
                SUM(t.price) as total_price
            FROM receipt r
            JOIN store s ON r.store_loc = s.address
            LEFT JOIN transactions t ON r.id = t.receipt_id
            GROUP BY r.id, r.date, r.store_loc, s.name
            ORDER BY r.date DESC
        `);
        return result.rows;
    },

    // Get receipt by ID with all transaction line items
    async getReceiptByID(receiptId) {
        const receiptResult = await db.query(`
            SELECT 
                r.id,
                r.date,
                r.store_loc,
                s.name as store_name
            FROM receipt r
            JOIN store s ON r.store_loc = s.address
            WHERE r.id = $1
        `, [receiptId]);

        if (!receiptResult.rows[0]) {
            return null;
        }

        const transactionsResult = await db.query(`
            SELECT 
                t.id,
                t.line_num,
                t.item,
                t.brand,
                t.category,
                t.price,
                t.quantity,
                t.pack_size,
                t.note
            FROM transactions t
            WHERE t.receipt_id = $1
            ORDER BY t.line_num
        `, [receiptId]);

        // Calculate totals
        const lineItems = transactionsResult.rows.filter(t => !['Tax', 'Fee'].includes(t.category));
        const tax = transactionsResult.rows.filter(t => t.category === 'Tax');
        const fees = transactionsResult.rows.filter(t => t.category === 'Fee');
        
        const subtotal = lineItems.reduce((sum, item) => sum + item.price, 0);
        const taxTotal = tax.reduce((sum, item) => sum + item.price, 0);
        const feeTotal = fees.reduce((sum, item) => sum + item.price, 0);
        const total = subtotal + taxTotal + feeTotal;

        return {
            ...receiptResult.rows[0],
            line_items: lineItems,
            tax: tax,
            fees: fees,
            subtotal: subtotal,
            tax_total: taxTotal,
            fee_total: feeTotal,
            total: total
        };
    },

    // Get receipts with filtering and sorting
    async getReceiptsByFilterAndSort(filters) {
        const conditions = [];
        const values = [];
        let paramCount = 1;

        if (filters.storeName) {
            conditions.push(`s.name ILIKE $${paramCount++}`);
            values.push(`%${filters.storeName}%`);
        }

        if (filters.dateStart && filters.dateEnd && filters.dateDir) {
            if (filters.dateDir === 'in') {
                conditions.push(`r.date::timestamp >= $${paramCount++}::timestamp AND r.date::timestamp <= $${paramCount++}::timestamp`);
                values.push(filters.dateStart, filters.dateEnd);
            } else if (filters.dateDir === 'out') {
                conditions.push(`r.date::timestamp <= $${paramCount++}::timestamp OR r.date::timestamp >= $${paramCount++}::timestamp`);
                values.push(filters.dateStart, filters.dateEnd);
            }
        } else if (filters.dateStart) {
            conditions.push(`r.date::timestamp >= $${paramCount++}::timestamp`);
            values.push(filters.dateStart);
        } else if (filters.dateEnd) {
            conditions.push(`r.date::timestamp <= $${paramCount++}::timestamp`);
            values.push(filters.dateEnd);
        }

        // Build WHERE clause
        const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

        // Build ORDER BY clause
        let orderBy = 'ORDER BY r.date DESC';
        if (filters.sortBy && filters.sortOrder) {
            if (filters.sortBy === 'date') {
                orderBy = `ORDER BY r.date ${filters.sortOrder}`;
            } else if (filters.sortBy === 'store_name') {
                orderBy = `ORDER BY s.name ${filters.sortOrder}`;
            } else if (filters.sortBy === 'total_price') {
                orderBy = `ORDER BY total_price ${filters.sortOrder}`;
            }
        }

        const query = `
            SELECT 
                r.id,
                r.date,
                r.store_loc,
                s.name as store_name,
                COUNT(t.id) as transaction_count,
                SUM(CASE WHEN t.category NOT IN ('Tax', 'Fee') THEN t.price ELSE 0 END) as subtotal,
                SUM(CASE WHEN t.category = 'Tax' THEN t.price ELSE 0 END) as tax_total,
                SUM(CASE WHEN t.category = 'Fee' THEN t.price ELSE 0 END) as fee_total,
                SUM(t.price) as total_price
            FROM receipt r
            JOIN store s ON r.store_loc = s.address
            LEFT JOIN transactions t ON r.id = t.receipt_id
            ${whereClause}
            GROUP BY r.id, r.date, r.store_loc, s.name
        `;

        // Apply price filtering after aggregation if needed
        if (filters.priceMin || filters.priceMax) {
            const havingConditions = [];
            if (filters.priceMin && filters.priceMax && filters.priceDir) {
                if (filters.priceDir === 'in') {
                    havingConditions.push(`SUM(t.price) >= $${paramCount++} AND SUM(t.price) <= $${paramCount++}`);
                    values.push(filters.priceMin, filters.priceMax);
                } else if (filters.priceDir === 'out') {
                    havingConditions.push(`SUM(t.price) <= $${paramCount++} OR SUM(t.price) >= $${paramCount++}`);
                    values.push(filters.priceMin, filters.priceMax);
                }
            } else if (filters.priceMin) {
                havingConditions.push(`SUM(t.price) >= $${paramCount++}`);
                values.push(filters.priceMin);
            } else if (filters.priceMax) {
                havingConditions.push(`SUM(t.price) <= $${paramCount++}`);
                values.push(filters.priceMax);
            }

            const finalQuery = havingConditions.length > 0 
                ? `${query} HAVING ${havingConditions.join(' AND ')} ${orderBy}`
                : `${query} ${orderBy}`;
            
            const result = await db.query(finalQuery, values);
            return result.rows;
        }

        const result = await db.query(`${query} ${orderBy}`, values);
        return result.rows;
    },

    // Calculate total for a receipt
    async calculateReceiptTotal(receiptId) {
        const result = await db.query(`
            SELECT 
                SUM(CASE WHEN category NOT IN ('Tax', 'Fee') THEN price ELSE 0 END) as subtotal,
                SUM(CASE WHEN category = 'Tax' THEN price ELSE 0 END) as tax_total,
                SUM(CASE WHEN category = 'Fee' THEN price ELSE 0 END) as fee_total,
                SUM(price) as total
            FROM transactions
            WHERE receipt_id = $1
        `, [receiptId]);
        
        return result.rows[0];
    }
}