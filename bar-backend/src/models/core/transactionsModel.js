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

    async getByFilterAndSort(item, brand, category, dateStart, dateEnd, dateDir, priceMin, priceMax, priceDir, sortBy, sortOrder) {
        // const result = await db.query('SELECT * FROM transactions WHERE id = $1', [transactionID]);
        // return result.rows[0];

        //id, item, brand, category, dateStart, dateEnd, dateDir, priceMin, priceMax, priceDir, sortBy, sortOrder

        const conditions = [];
        const sort = [];
        const values = [];
        let paramCount = 1;

        if (item) {
            conditions.push(`item = $${paramCount++}`);
            values.push(item);
        }

        if (brand) {
            conditions.push(`brand = $${paramCount++}`);
            values.push(brand);
        }

        if (category) {
            conditions.push(`category = $${paramCount++}`);
            values.push(category);
        }

        if (dateStart && dateEnd && dateDir) {
            if (dateDir === 0) {
                conditions.push(`date BETWEEN $${paramCount++} AND $${paramCount++}`);
                values.push(dateStart, dateEnd);
            } else if (dateDir === 1) {
                conditions.push(`date <= $${paramCount++} OR date >= $${paramCount++}`);
                values.push(dateStart, dateEnd);
            }
        } 

        if (dateStart && !dateEnd) {
            conditions.push(`date >= $${paramCount++}`);
            values.push(dateStart);
        }

        if (!dateStart && dateEnd) {
            conditions.push(`date <= $${paramCount++}`);
            values.push(dateEnd);
        }
            // conditions.push(`date = $${paramCount++}`);
            // values.push(filters.date);

        if (priceMin && priceMax && priceDir) {
            if (priceDir === 0) {
                conditions.push(`price BETWEEN $${paramCount++} AND $${paramCount++}`);
                values.push(priceMin, priceMax);
            } else if (priceDir === 1) {
                conditions.push(`price <= $${paramCount++} OR price >= $${paramCount++}`);
                values.push(priceMin, priceMax);
            }
        } 

        if (priceMin && !priceMax) {
            conditions.push(`price >= $${paramCount++}`);
            values.push(priceMin);
        }

        if (!priceMin && priceMax) {
            conditions.push(`price <= $${paramCount++}`);
            values.push(priceMax);
        }

        if (sortBy && sortOrder) {
            sort.push(`${sortBy} ${sortOrder}, id ASC`);
        }

        console.log(conditions);
        console.log(sort);

        const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
        const sortClause = sort.length > 0 ? 'ORDER BY ' + sort[0] + sort[1] : 'ORDER BY id ASC';

        // console.log('WHERE clause:', whereClause);
        // console.log('SORT clause:', sortClause);

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