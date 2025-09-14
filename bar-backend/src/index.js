import express from 'express';
import transactionRoute from './routes/core/transactions.js';


const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/core/transactions', transactionRoute);

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// app.get('/page', (req, res) => {
//     res.send('This is a new page')
// })

app.listen(port, () => {
    console.log(`Example app listening on this port ${port}`)
})