import { ReceiptService } from "../../services/core/receiptService.js";


export const ReceiptController = {
    async getAllReceipts(req, res, next) {
        try {
            const receipts = await ReceiptService.getAllReceipts();
            res.status(200).json(receipts);
        } catch (error) {
            next(error);
        }
        // res.send('Get all transactions');
    },

    async getListView(req, res, next) {
        try {
            const filters = {
                storeName: req.query.storeName || null,
                dateStart: req.query.dateStart || null,
                dateEnd: req.query.dateEnd || null,
                dateDir: req.query.dateDir || null,
                priceMin: req.query.priceMin || null,
                priceMax: req.query.priceMax || null,
                priceDir: req.query.priceDir || null,
                sortBy: req.query.sortBy || null,
                sortOrder: req.query.sortOrder || null
            };

            // startDate, endDate, dateDir, store_name, minPrice, maxPrice, priceDir, sortBy, sortOrder

            console.log(filters);
            
            const receipts = await ReceiptService.getListView(filters);
            // console.log(transactions);
            res.status(200).json(receipts);
        } catch (error) {
            next(error);
        }
    },

    async getReceiptById(req, res, next) {
        try {
            const receiptID = parseInt(req.params.id);
            // console.log(receiptID);
            if (isNaN(receiptID)) {
                return res.status(400).send({ message: 'Invalid receipt ID' });
            }
            const receipt = await ReceiptService.getReceiptByID(receiptID);
            res.status(200).json(receipt);
        } catch (error) {
            next(error);
        }
        // const transactionID = parseInt(req.params.id);
        // res.send(`Get transaction by ID: ${transactionID}`);
    },

    async getTransactionsByReceiptDate(req, res, next) {
        try {
            const date = req.query.date;
            console.log("Controller: ", date);
            const transactions = await ReceiptService.getTransactionsByReceiptDate(date);
            res.status(200).json(transactions);
        } catch (error) {
            next(error);
        }
    },

    async createReceipt(req, res, next) {
        try {
            console.log("Controller: createReceipt called with:", req.body.date, req.body.store_loc);
            const receipt = await ReceiptService.createReceipt(req.body);
            res.status(200).json(receipt);
        } catch (error) {
            next(error);
        }
        // const transaction = req.body.item;
        // console.log(req.body);
        // res.send(transaction);
    },

    async updateReceipt(req, res, next) {
        try {
            const receiptID = parseInt(req.params.id);
            const updatedData = req.body;

            if (isNaN(receiptID)) {
                return res.status(400).send({ message: 'Invalid receipt ID' });
            }

            // Assuming ReceiptService has an updateReceipt method
            const updatedReceipt = await ReceiptService.updateReceipt(receiptID, updatedData);
            res.status(200).json(updatedReceipt);
        } catch (error) {
            next(error);
        }
    },

    async deleteReceipt(req, res, next) {
        try {
            const receiptID = parseInt(req.params.id);
            const receipt = await ReceiptService.deleteReceipt(receiptID);
            res.status(200).json(receipt);
        } catch (error) {
            next(error);
        }
        // const transactionID = parseInt(req.params.id);
        // res.send(`Delete old transaction: ${transactionID}`);
    },
}