import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE } = process.env;
const PAYPAL_API = PAYPAL_MODE === 'sandbox' 
  ? 'https://api-m.sandbox.paypal.com' 
  : 'https://api-m.paypal.com';

// 1. PayPal Access Token ekak laba genimata udaw wana sarala function ekak
const generateAccessToken = async () => {
    try {
        const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
        const response = await axios({
            url: `${PAYPAL_API}/v1/oauth2/token`,
            method: "POST",
            data: "grant_type=client_credentials",
            headers: { Authorization: `Basic ${auth}` },
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};

// 2. Order ekak Create karana Route eka (Frontend eken meka ktha karai)
router.post('/create-order', async (req, res) => {
    const { amount } = req.body; // Guide ගේ Booking Fee එක
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
                    amount: {
                        currency_code: "USD",
                        value: amount,
                    },
                }],
            }),
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("PayPal Create Order Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Failed to create PayPal order" });
    }
});

// 3. Payment eka sarthaka unama eka Confirm/Capture karana Route eka
router.post('/capture-order', async (req, res) => {
    const { orderID } = req.body;
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
        res.status(200).json(response.data); // Payment Success!
    } catch (error) {
        console.error("PayPal Capture Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Failed to capture PayPal order" });
    }
});

export default router;