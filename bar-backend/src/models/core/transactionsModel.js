import db from '../../config/db.js';

export const TransactionModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM transactions');
        return result.rows;
    },
    
    async getByID(transactionID) {
        const result = await db.query('SELECT * FROM transactions WHERE id = $1', [transactionID]);
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

    async create({ receipt_id, line_num, item, brand, category, date, price, note, created_at, updated_at }) {
        console.log("Model: create called with:", { receipt_id, line_num, item, brand, category, date, price, note });

        const result = await db.query(`
            INSERT INTO transactions 
            (receipt_id, line_num, item, brand, category, date, price, note, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `, [receipt_id, line_num, item, brand, category, date, price, note, created_at, updated_at]
        );
        console.log("Model: create result:", result.rows[0]);
        return result.rows[0];
    },

    async update(query, values) {
        const result = await db.query(query, values);
        if(!result) {
            throw new Error('Failed to update transaction in the model');
        }
        return result.rows[0];
    },

    async delete(transactionID) {
        const result = await db.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [transactionID]);
        return result.rowCount;
    }
};