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

    async createReceipt(req, res, next) {
        try {
            const receipt = await ReceiptService.createReceipt(req.body);
            res.status(200).json(receipt);
        } catch (error) {
            next(error);
        }
        // const transaction = req.body.item;
        // console.log(req.body);
        // res.send(transaction);
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