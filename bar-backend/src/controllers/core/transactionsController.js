import { TransactionService } from "../../services/core/transactionsService.js";


// TO-DO: apply error handling to other controllers
export const TransactionController = {
    async getAllTransactions(req, res, next) {
        try {
            const transactions = await TransactionService.getAllTransactions();
            res.status(200).json(transactions);
        } catch (error) {
            next(error);

        }
        // res.send('Get all transactions');
    },

    async getTransactionById(req, res, next) {
        try {
            const transactionID = parseInt(req.params.id);
            // console.log(transactionID);
            if (isNaN(transactionID)) {
                return res.status(400).send({ message: 'Invalid transaction ID' });
            }
            const transaction = await TransactionService.getTransactionByID(transactionID);
            res.status(200).json(transaction);
        } catch (error) {
            next(error);
        }
        // const transactionID = parseInt(req.params.id);
        // res.send(`Get transaction by ID: ${transactionID}`);
    },

    async getTransactionsByFilter(req, res, next) {
        try {
            const filters = {
                item: req.query.item || null,
                brand: req.query.brand || null,
                category: req.query.category || null,
                date: req.query.date || null,
                price: req.query.price || null,
            };

            // console.log(filters);
            
            const transactions = await TransactionService.getTransactionsByFilter(filters);
            // console.log(transactions);
            res.status(200).json(transactions);
        } catch (error) {
            next(error);
        }
    },

    async getAutoPrice(req, res, next) {
        console.log("Controller: getAutoPrice called");
        try {
            const filters = {
                item: req.query.item || null,
                brand: req.query.brand || null,
            };

            const price = await TransactionService.getAutoPrice(filters);
            res.status(200).json(price);
            console.log("Controller layer passed");
        } catch (error) {
            next(error);
        }
    },

    async createTransaction(req, res, next) {
        try {
            console.log("Controller: createTransaction called");
            console.log("Request body:", req.body);
            const transaction = await TransactionService.createTransaction(req.body);
            res.status(200).json(transaction);
        } catch (error) {
            next(error);
        }
        // const transaction = req.body.item;
        // console.log(req.body);
        // res.send(transaction);
    },

    async updateTransaction(req, res, next) {
        try {
            const transactionID = parseInt(req.params.id);
            // console.log(transactionID);
            // console.log(req.body);
            const transaction = await TransactionService.updateTransaction(transactionID, req.body);
            res.status(200).json(transaction);
        } catch (error) {
            next(error);
        }
        // const transactionID = parseInt(req.params.id);
        // res.send(`Update existing transaction: ${transactionID}`);
    },

    async deleteTransaction(req, res, next) {
        try {
            const transactionID = parseInt(req.params.id);
            const transaction = await TransactionService.deleteTransaction(transactionID);
            res.status(200).json(transaction);
        } catch (error) {
            next(error);
        }
        // const transactionID = parseInt(req.params.id);
        // res.send(`Delete old transaction: ${transactionID}`);
    },
}