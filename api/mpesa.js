export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { phone, amount } = req.body;

  if (!phone || !amount) {
    return res.status(400).json({ error: 'Phone and amount are required' });
  }

  // Credentials provided by the user
  const consumerKey = 'vKZqhaW9NtnE3p7XBcrmM4zamGbeckQEW1oC4VGTH8om3COw';
  const consumerSecret = 'PzEqEA1CGogtPBHKeNEKwcAGSjIsn5uCkg40lMqBoCuQK7z3kFfIa1WLYY9QEC2t';
  
  // Safaricom Sandbox default values for Passkey & Shortcode testing
  const passKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; 
  const shortCode = '174379'; 

  try {
    // 1. Get OAuth Token from Daraja
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenResponse = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`
      }
    });

    if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token Error:", errorText);
        return res.status(500).json({ success: false, error: 'Failed to authenticate with M-Pesa' });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Generate Password & Timestamp for STK Push
    const date = new Date();
    const timestamp = date.getFullYear().toString() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2);

    const password = Buffer.from(shortCode + passKey + timestamp).toString('base64');

    // 3. Initiate proper STK Push
    const stkPayload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount), // API requires integer amounts
      PartyA: phone, // Customer Phone Number Format: 254...
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: "https://snack-have-hun.vercel.app/api/callback", // Replace if you configure a DB response handler in the future
      AccountReference: "SnackHaveHun",
      TransactionDesc: "Payment for Snacks"
    };

    const stkResponse = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stkPayload)
    });

    const stkData = await stkResponse.json();

    if (stkData.ResponseCode === '0') {
      return res.status(200).json({ success: true, data: stkData });
    } else {
      console.error('STK Push Error:', stkData);
      return res.status(400).json({ success: false, error: stkData.errorMessage || 'STK Push Failed' });
    }

  } catch (error) {
    console.error('M-Pesa API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
