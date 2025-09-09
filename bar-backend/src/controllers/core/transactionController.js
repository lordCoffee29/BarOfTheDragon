export const TransactionController = {
    async getAllTransactions(req, res) {
        res.send('Get all transactions');
    },

    async getTransactionById(req, res) {
        const transactionID = parseInt(req.params.id);
        res.send(`Get transaction by ID: ${transactionID}`);
    },

    async createTransaction(req, res) {
        // const transaction = req.body.item;
        console.log(req.body);
        res.send(`transaction`);
    },

    async updateTransaction(req, res) {
        const transactionID = parseInt(req.params.id);
        res.send(`Update existing transaction: ${transactionID}`);
    },

    async deleteTransaction(req, res) {
        const transactionID = parseInt(req.params.id);
        res.send(`Delete old transaction: ${transactionID}`);
    },
}