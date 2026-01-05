import db from '../../config/db.js';

export const ReceiptModel = {
    async getAll() {
        const result = await db.query('SELECT * FROM receipt');
        return result.rows;
    },

    async getListView(filters) {

        // startDate, endDate, dateDir, store_name, minPrice, maxPrice, priceDir, sortBy, sortOrder
        const columnMap = {
            'date': 'r.date',
            'store_name': 's.name',
            'total_price': 'total_price'
        }

        const validSortBy = columnMap[filters.sortBy] || 'r.date';
        const validSortOrder = 'DESC';

        if (filters.sortOrder) {
            const validSortOrder = filters.sortOrder.toUpperCase();
        }

        const conditions = [];
        const havingConditions = [];
        const sort = [];
        const values = [];
        let paramCount = 1;

        if (filters.storeName) {
            conditions.push(`s.name = $${paramCount++}`);
            values.push(filters.storeName);
        }

        if (filters.dateStart && filters.dateEnd && filters.dateDir) {
            if (filters.dateDir === 'in') {
                conditions.push(`(r.date::timestamp >= $${paramCount++}::timestamp AND r.date::timestamp <= $${paramCount++}::timestamp)`);
                values.push(filters.dateStart, filters.dateEnd);
            } else if (filters.dateDir === 'out') {
                conditions.push(`(r.date::timestamp <= $${paramCount++}::timestamp OR r.date::timestamp >= $${paramCount++}::timestamp)`);
                values.push(filters.dateStart, filters.dateEnd);
            }
        } 

        if (filters.dateStart && !filters.dateEnd) {
            conditions.push(`(r.date::timestamp >= $${paramCount++}::timestamp)`);
            values.push(filters.dateStart);
        }

        if (!filters.dateStart && filters.dateEnd) {
            conditions.push(`(r.date::timestamp <= $${paramCount++}::timestamp)`);
            values.push(filters.dateEnd);
        }

        if (filters.priceMin && filters.priceMax && filters.priceDir) {
            if (filters.priceDir === 'in') {
                havingConditions.push(`(SUM(t.price) >= $${paramCount++} AND SUM(t.price) <= $${paramCount++})`);
                values.push(filters.priceMin, filters.priceMax);
            } else if (filters.priceDir === 'out') {
                havingConditions.push(`(SUM(t.price) < $${paramCount++} OR SUM(t.price) > $${paramCount++})`);
                values.push(filters.priceMin, filters.priceMax);
            }
        } 

        if (filters.priceMin && !filters.priceMax) {
            havingConditions.push(`SUM(t.price) >= $${paramCount++}`);
            values.push(filters.priceMin);
        }

        if (!filters.priceMin && filters.priceMax) {
            havingConditions.push(`SUM(t.price) <= $${paramCount++}`);
            values.push(filters.priceMax);
        }

        if (filters.sortBy && filters.sortOrder) {
            sort.push(`${filters.sortBy} ${filters.sortOrder}, r.id ASC`);
        }

        if (filters.sortBy && !filters.sortOrder) {
            sort.push(`${filters.sortBy} ASC, r.id ASC`);
        }

        if (!filters.sortBy && filters.sortOrder) {
            sort.push(`r.id ${filters.sortOrder}`);
        }

        if (!filters.sortBy && !filters.sortOrder) {
            sort.push(`r.id ASC`);
        }

        const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
        const havingClause = havingConditions.length > 0 ? 'HAVING ' + havingConditions.join(' AND ') : '';
        const sortClause = sort.length > 0 ? 'ORDER BY ' + sort[0] : 'ORDER BY r.date DESC';

        const query = `
            SELECT 
                r.id,
                r.date,
                s.name AS store_name,
                ROUND(CAST(SUM(t.price) AS numeric), 2) AS total_price
            FROM receipt r
            INNER JOIN transactions t ON r.id = t.receipt_id
            INNER JOIN store s ON r.store_loc = s.address
            ${whereClause}
            GROUP BY r.id, r.date, s.name, t.price
            ${havingClause}
            ${sortClause}
        `;

        const result = await db.query(query, values);
        return result.rows;
    },
    
    async getByID(id) {
        const result = await db.query('SELECT * FROM receipt WHERE id = $1', [id]);
        return result.rows[0]; 
    },

    async getTransactionsByReceiptDate(date) {
        console.log(date);
        const result = await db.query('SELECT * FROM transactions WHERE date = $1', [date]);
        return result.rows;
    },

    async create({ date, store_loc }) {
        console.log("Model: create called with:", { date, store_loc }); 
        const result = await db.query(`
            INSERT INTO receipt 
            (date, store_loc) 
            VALUES ($1, $2) RETURNING *
        `, [date, store_loc]
        );
        return result.rows[0];
    },

    async update(id, { date, store_loc }) {
        const result = await db.query(`
            UPDATE receipt 
            SET date = $1, store_loc = $2 
            WHERE id = $3 
            RETURNING *
        `, [date, store_loc, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await db.query('DELETE FROM receipt WHERE id = $1 RETURNING *', [id]);
        return result.rowCount;
    }
};