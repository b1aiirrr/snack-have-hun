import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phoneNumber, amount } = req.body;

  // --- YOUR SNACKFINAL KEYS (Hardcoded for stability) ---
  const consumerKey = "2PeI9wOGx9xCFu0qPR95L6PHcuAddjLr1TOSXdmTUEcvpbJI";
  const consumerSecret = "XJjjza8eDKVEUYGg0uZMI1qOwDGX39mw7yz0YJKc9OGxhQcu5mWlAk5sGlYwJED5";
  const shortCode = "174379";
  const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  
  // Dynamic Callback URL based on your live site
  const callbackUrl = `https://${req.headers.host}/api/callback`; 

  try {
    // 1. Get Token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenResponse = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const accessToken = tokenResponse.data.access_token;

    // 2. Generate Timestamp & Password
    const date = new Date();
    const timestamp = date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    // 3. Format Phone (Remove + or 0, add 254)
    let formattedPhone = String(phoneNumber).trim().replace('+', '');
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.substring(1);

    console.log(`Attempting pay for ${formattedPhone}`);

    // 4. Send Request
    const stkResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 1, // FORCE 1 KES FOR TESTING
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: "SnackHaveHun",
        TransactionDesc: "Payment"
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return res.status(200).json(stkResponse.data);

  } catch (error) {
    console.error("Daraja Error raw:", error);

    const data = error.response?.data;
    const status = error.response?.status;

    console.error("Daraja Error details:", JSON.stringify({ status, data }, null, 2));

    return res.status(500).json({
      message: "Daraja request failed",
      status,
      data,
    });
  }
}