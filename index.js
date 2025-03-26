const express = require('express')
const dotenv = require('dotenv')
const paypal = require('./services/paypal')

dotenv.config()
const app = express()

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

// Create PayPal Order
app.post('/pay', async(req, res) => {
    try {
        const url = await paypal.createOrder()
        res.json({ approvalUrl: url }) // Send the PayPal approval URL to the frontend
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Capture payment after redirection
app.get('/complete-order', async (req, res) => {
    try {
        await paypal.capturePayment(req.query.token)
        res.send('Payment successful. You can close this window.')
    } catch (error) {
        res.send('Error: ' + error.message)
    }
})

// Cancel order redirection
app.get('/cancel-order', (req, res) => {
    res.send('Payment canceled. You can close this window.')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
