const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- YOUR CREDENTIALS ---
const consumerKey = '2PeI9wOGx9xCFu0qPR95L6PHcuAddjLr1TOSXdmTUEcvpbJI';
const consumerSecret = 'XJjjza8eDKVEUYGg0uZMI1qOwDGX39mw7yz0YJKc9OGxhQcu5mWlAk5sGlYwJED5';
const callbackUrl = 'https://shaky-trams-throw.loca.lt/callback';

// --- 1. AUTHENTICATION ---
const getAccessToken = async (req, res, next) => {
    try {
        // IF YOU DON'T SEE THIS LOG, THE FILE DID NOT SAVE
        console.log('1. 🔑 Authenticating with SnackFinal Keys...');
        
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            { headers: { Authorization: `Basic ${auth}` } }
        );
        req.token = response.data.access_token;
        console.log('✅ Token Generated Successfully!');
        next();
    } catch (error) {
        console.error('❌ AUTH ERROR:', error.message);
        res.status(400).json({ error: 'Auth Failed' });
    }
};

// --- 2. STK PUSH ---
app.post('/stkpush', getAccessToken, async (req, res) => {
    console.log('2. 📲 Sending STK Push to phone...');
    const { phoneNumber } = req.body;
    
    // FORMAT PHONE (Ensure it starts with 254)
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) formattedPhone = '254' + phoneNumber.slice(1);

    // TIMESTAMP
    const date = new Date();
    const timestamp = date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);

    const shortCode = '174379';
    const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');

    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: shortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: 1, 
                PartyA: formattedPhone, 
                PartyB: shortCode,
                PhoneNumber: formattedPhone,
                CallBackURL: callbackUrl, 
                AccountReference: "SnackHaveHun",
                TransactionDesc: "Food Order"
            },
            { headers: { Authorization: `Bearer ${req.token}` } }
        );
        console.log('✅ STK Push Sent!');
        res.json(response.data);
    } catch (error) {
        console.error('❌ PUSH ERROR:', error.message);
        if(error.response) console.error(JSON.stringify(error.response.data));
        res.status(500).json({ error: 'Push Failed' });
    }
});

// --- 3. RECEIPT HANDLER ---
app.post('/callback', (req, res) => {
    console.log('📩 RECEIPT RECEIVED:', JSON.stringify(req.body));
    res.send('OK');
});

app.listen(5000, () => console.log('🚀 SERVER RELOADED - WAITING FOR ORDERS'));