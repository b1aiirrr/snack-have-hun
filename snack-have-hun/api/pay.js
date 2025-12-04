import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phoneNumber, amount } = req.body;

  // --- 1. CONFIGURATION (Hardcoded for simplicity based on your SnackFinal app) ---
  const consumerKey = "2PeI9wOGx9xCFu0qPR95L6PHcuAddjLr1TOSXdmTUEcvpbJI";
  const consumerSecret = "XJjjza8eDKVEUYGg0uZMI1qOwDGX39mw7yz0YJKc9OGxhQcu5mWlAk5sGlYwJED5";
  const shortCode = "174379";
  const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  
  // Use your live Vercel URL for the callback
  // AUTOMATICALLY DETECTS YOUR VERCEL URL
  const callbackUrl = `https://${req.headers.host}/api/callback`; 

  try {
    // --- 2. GET ACCESS TOKEN ---
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenResponse = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const accessToken = tokenResponse.data.access_token;

    // --- 3. GENERATE PASSWORD ---
    const date = new Date();
    const timestamp = date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    // --- 4. FORMAT PHONE NUMBER (Ensure 254...) ---
    let formattedPhone = phoneNumber.replace('+', '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }

    // --- 5. TRIGGER STK PUSH ---
    const stkResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 1, // FORCE 1 KES FOR TESTING (Change to 'amount' later)
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: "SnackHaveHun",
        TransactionDesc: "Order Payment"
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return res.status(200).json(stkResponse.data);

  } catch (error) {
    console.error("M-Pesa Error:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
}