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

    async createTransaction(req, res, next) {
        try {
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