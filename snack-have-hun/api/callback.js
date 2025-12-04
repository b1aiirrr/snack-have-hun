export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log("💰 PAYMENT RECEIPT:", JSON.stringify(req.body, null, 2));
    // In a real app, you would update your Supabase database here to say "Order Paid"
    res.status(200).json({ result: "ok" });
  } else {
    res.status(405).json({ message: "Only POST allowed" });
  }
}