import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE } = process.env;
const PAYPAL_API = PAYPAL_MODE === 'sandbox' 
  ? 'https://api-m.sandbox.paypal.com' 
  : 'https://api-m.paypal.com';

// 1. Generate Access Token from PayPal
const generateAccessToken = async () => {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await axios({
      url: `${PAYPAL_API}/v1/oauth2/token`,
      method: "POST",
      data: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate PayPal Access Token:", error.response?.data || error.message);
    throw new Error("PayPal authentication failed");
  }
};

// 2. Create Order Route (Handles dynamic amount, guideId, and payer metadata)
router.post('/create-order', async (req, res) => {
  const { amount, guideId, payerName, payerEmail } = req.body;
  const formattedAmount = Number(amount || 25.00).toFixed(2);

  try {
    const accessToken = await generateAccessToken();
    const response = await axios({
      url: `${PAYPAL_API}/v2/checkout/orders`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: guideId ? String(guideId) : "guide_booking",
          description: `Guide Booking Fee${guideId ? ` (Guide ID: ${guideId})` : ''}`,
          custom_id: guideId ? String(guideId) : undefined,
          amount: {
            currency_code: "USD",
            value: formattedAmount,
          },
        }],
        application_context: {
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
        }
      }),
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("PayPal Create Order Error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Failed to create PayPal order", 
      error: error.response?.data || error.message 
    });
  }
});

// 3. Capture Order Route (Supports both /capture and /capture-order)
const captureOrder = async (req, res) => {
  const { orderID, guideId } = req.body;
  if (!orderID) {
    return res.status(400).json({ message: "Order ID is required to capture payment" });
  }

  try {
    const accessToken = await generateAccessToken();
    const response = await axios({
      url: `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.status === "COMPLETED") {
      console.log(`Payment captured successfully for Order ${orderID}, Guide: ${guideId || 'N/A'}`);
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error("PayPal Capture Error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Failed to capture PayPal order", 
      error: error.response?.data || error.message 
    });
  }
};

router.post('/capture', captureOrder);
router.post('/capture-order', captureOrder);

export default router;